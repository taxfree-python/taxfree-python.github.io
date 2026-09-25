#!/usr/bin/env python3
"""Build content/data/attention-memory-followup.json from the Olmo Hybrid result reports.

Usage:
  python3 scripts/attention-memory/build_followup_data.py [RESULTS_DIR]

RESULTS_DIR defaults to ~/Projects/attention-memory/olmo/results. Every number in the
output is copied from these reports (medians are the reports' own `by_layer` medians);
nothing is recomputed except consistency checks, which abort on mismatch.

- native-fact-triplets/report.json            single-layer beta=0 on span A, per layer
- fair-baseline-20260925/report.json          per-layer local-regression ratios
- all-layer-intervention-20260925/report.json beta=0 in all 24 GDN layers at once
- control-fix-20260925/report.json            corrected control span for highest-court
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path

ROLES = ("same_fact_a", "same_fact_b", "other_fact")
SOURCES = {
    "single": "native-fact-triplets/report.json",
    "fairBaseline": "fair-baseline-20260925/report.json",
    "allLayer": "all-layer-intervention-20260925/report.json",
    "controlFix": "control-fix-20260925/report.json",
}
# Output key -> fair-baseline metric name.
RATIOS = {"before": "R_before", "prefix": "R_prefix_offline", "passage": "R_passage", "A": "R_A"}

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "content/data/attention-memory-followup.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def D(delta: dict) -> float:
    return delta["other_fact"] - (delta["same_fact_a"] + delta["same_fact_b"]) / 2


def check(ok: bool, what: str) -> None:
    if not ok:
        sys.exit(f"consistency check failed: {what}")


def close(a: float, b: float) -> bool:
    return math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-12)


def roles(values: dict) -> dict:
    return {role: values[role] for role in ROLES}


def main() -> None:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Projects/attention-memory/olmo/results"
    reports = {key: json.loads((root / rel).read_text()) for key, rel in SOURCES.items()}
    single, fair, all_layer, fix = (reports[k] for k in ("single", "fairBaseline", "allLayer", "controlFix"))

    # Local-regression ratios: the report's per-layer medians over all 30 questions.
    layers = sorted(int(layer) for layer in fair["by_layer"])
    local_loss = []
    for layer in layers:
        stats = fair["by_layer"][str(layer)]["all"]
        row = {"layer": layer}
        for key, metric in RATIOS.items():
            check(stats[metric]["n"] == 30, f"n=30 at layer {layer} {metric}")
            row[key] = stats[metric]["median"]
        local_loss.append(row)

    fixed_control = {row["triplet"]: row for row in fix["affected_table"]}
    check(set(fixed_control) == set(fix["affected_triplets"]), "affected_table covers affected_triplets")
    all_by_id = {t["triplet"]: t for t in all_layer["triplets"]}

    triplets = []
    for t in single["triplets"]:
        tid = t["id"]
        a = all_by_id[tid]
        check(a["target_write_text"] == t["target_write_text"], f"{tid} target text")
        per_layer = [{"layer": l["layer"], "delta": roles(l["delta_answer_logp"])} for l in t["layers"]]
        check([l["layer"] for l in per_layer] == layers, f"{tid} layer set")

        delta = a["delta_all_layers"]
        if tid in fixed_control:
            fixed = fixed_control[tid]["all_layer"]
            control, control_d = roles(fixed["delta_control_new"]), fixed["D_control_new"]
            check(close(fixed["D_A"], a["D_all_layers"]["answer_span"]), f"{tid} D_A matches all-layer report")
        else:
            control, control_d = roles(delta["control_span"]), a["D_all_layers"]["control_span"]
        check(close(control_d, fix["all_layer_D_per_triplet"][tid]["control_fixed"]), f"{tid} fixed control D")
        check(close(D(control), control_d), f"{tid} control D from deltas")

        sums = a["single_layer_A"]["sum_delta"]
        for role in ROLES:
            check(close(sum(l["delta"][role] for l in per_layer), sums[role]), f"{tid} single-layer sum {role}")

        entry = {
            "id": tid,
            "targetWriteText": t["target_write_text"],
            "questions": [{"id": q["id"], "role": q["role"]} for q in t["questions"]],
            "singleLayerA": per_layer,
            "singleLayerSumA": {"delta": roles(sums), "D": a["single_layer_A"]["sum_D"]},
            "allLayer": {
                "A": {"delta": roles(delta["answer_span"]), "D": a["D_all_layers"]["answer_span"]},
                "control": {"delta": control, "D": control_d, "fixed": tid in fixed_control},
                "passage": {"delta": roles(delta["passage"]), "D": a["D_all_layers"]["passage"]},
            },
        }
        for variant in ("A", "passage"):
            v = entry["allLayer"][variant]
            check(close(D(v["delta"]), v["D"]), f"{tid} {variant} D from deltas")
        triplets.append(entry)

    out = {
        "sources": [{"path": f"olmo/results/{rel}", "sha256": sha256(root / rel)} for rel in SOURCES.values()],
        "notes": {
            "delta": "Δlog p of the SQuAD answer string (nats) vs the unmodified run, teacher-forced.",
            "D": "Δ(other_fact) − mean(Δ(same_fact_a), Δ(same_fact_b))",
            "localLoss": "per-GDN-layer median over 30 questions of question-token loss / loss of the reference state; "
                         "before: S=0, prefix: all pre-question writes removed (offline), passage: passage writes "
                         "removed in that layer, A: span A writes removed in that layer",
            "control": "highest-court uses the corrected control span (control-fix-20260925)",
        },
        "layers": layers,
        "localLoss": local_loss,
        "triplets": triplets,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {OUT.relative_to(REPO)}: {len(triplets)} triplets, {len(layers)} layers")


if __name__ == "__main__":
    main()
