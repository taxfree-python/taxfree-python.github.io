#!/usr/bin/env python3
"""Build articles/2026-09-26/data/followup-final31.json from the final 31-triplet report.

Usage:
  python3 articles/2026-09-26/scripts/build_followup_data_final31.py [RESULTS_DIR]

If the report has no single-layer part, single-layer fields are null.
RESULTS_DIR defaults to ~/Projects/attention-memory/olmo/results. Same output schema as
build_followup_data.py (layers, localLoss, triplets[...]) for the frozen final set
(31 triplets / 93 questions, counterfactuals v6 FROZEN_SELECTION_ok31), plus additive
fields (title, singleLayerControl, allLayer.prefix). Every number is copied from the
report; nothing is recomputed except consistency checks, which abort on mismatch.

- final31-report-with-single-20260926/report.json  (olmo/final31_report.py over
  final31-all-layer-20260926 and final31-single-layer-20260926; controls from
  final31-controls-20260926, the fixed control rule applied to every triplet)
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path

ROLES = ("same_fact_a", "same_fact_b", "other_fact")
SOURCE = "final31-report-with-single-20260926/report.json"
N_QUESTIONS = 93
# Output key -> report metric name.
RATIOS = {"before": "R_before", "prefix": "R_prefix", "passage": "R_passage", "A": "R_A"}

REPO = Path(__file__).resolve().parents[3]
OUT = REPO / "articles/2026-09-26/data/followup-final31.json"


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
    report = json.loads((root / SOURCE).read_text())
    a = report["all_layer"]
    s, cmp = report.get("single"), report.get("single_vs_all_layer")
    have_single = s is not None
    check(a["checks"]["questions"] == N_QUESTIONS, "all-layer questions")
    check(a["checks"]["passive_logit_bitwise_equal_all"] and a["checks"]["cache_object_identity_all"], "all-layer passive/cache checks")
    check(a["checks"]["first_gdn_layer_upstream_max_abs_difference"] == 0, "all-layer upstream difference")
    layers, local_loss, dcells, cmp_by = None, None, {}, {}
    if have_single:
        check(s["checks"]["questions"] == N_QUESTIONS, "single questions")
        check(s["checks"]["passive_logit_bitwise_equal_all"] and s["checks"]["cache_object_identity_all"], "single passive/cache checks")
        check(s["checks"]["offline_vs_native_agree"], "offline vs native agreement")
        layers = s["layers"]
        local_loss = []
        for layer in layers:
            stats = s["R"]["by_layer"][str(layer)]["all"]
            row = {"layer": layer}
            for key, metric in RATIOS.items():
                check(stats[metric]["n"] == N_QUESTIONS, f"n={N_QUESTIONS} at layer {layer} {metric}")
                row[key] = stats[metric]["median"]
            local_loss.append(row)
        dcells = {(d["triplet"], d["layer"]): d for d in s["D_cells"]}
        cmp_by = {c["triplet"]: c for c in cmp["triplets"]}
    questions = {}
    for q in a["questions"]:
        questions.setdefault(q["triplet"], []).append({"id": q["id"], "role": q["role"]})

    triplets = []
    for t in a["triplets"]:
        tid = t["triplet"]
        per_layer_A = per_layer_C = sum_A = sum_C = None
        if have_single:
            per_layer_A = [{"layer": L, "delta": roles(dcells[(tid, L)]["delta_A"])} for L in layers]
            per_layer_C = [{"layer": L, "delta": roles(dcells[(tid, L)]["delta_control"])} for L in layers]
            for L in layers:
                d = dcells[(tid, L)]
                check(close(D(d["delta_A"]), d["D_A"]) and close(D(d["delta_control"]), d["D_control"]), f"{tid} L{L} single D")
            c = cmp_by[tid]
            for role in ROLES:
                check(close(sum(l["delta"][role] for l in per_layer_A), c["single_sum_delta_A"][role]), f"{tid} single-layer sum {role}")
            check(close(D(c["single_sum_delta_A"]), c["single_sum_D_A"]), f"{tid} single sum D")
            sum_A = {"delta": roles(c["single_sum_delta_A"]), "D": c["single_sum_D_A"]}
            sum_C = {"delta": roles(c["single_sum_delta_control"]), "D": c["single_sum_D_control"]}
        delta = t["delta"]
        entry = {
            "id": tid,
            "title": t["title"],
            "targetWriteText": t["target"],
            "questions": questions[tid],
            "singleLayerA": per_layer_A,
            "singleLayerSumA": sum_A,
            "singleLayerControl": per_layer_C,
            "singleLayerSumControl": sum_C,
            "allLayer": {
                "A": {"delta": roles(delta["answer_span"]), "D": t["D"]["answer_span"]},
                "control": {"delta": roles(delta["control_span"]), "D": t["D"]["control_span"], "fixed": True},
                "passage": {"delta": roles(delta["passage"]), "D": t["D"]["passage"]},
                "prefix": {"delta": roles(delta["prefix"]), "D": t["D"]["prefix"]},
            },
        }
        for variant, v in entry["allLayer"].items():
            check(close(D(v["delta"]), v["D"]), f"{tid} {variant} D from deltas")
        triplets.append(entry)
    check(len(triplets) == N_QUESTIONS // 3, "31 triplets")

    out = {
        "sources": [{"path": f"olmo/results/{SOURCE}", "sha256": sha256(root / SOURCE)}],
        "notes": {
            "cohort": "31 triplets / 93 questions: counterfactuals v6 FROZEN_SELECTION_ok31 (clean passages only)",
            "delta": "Δlog p of the SQuAD answer string (nats) vs the unmodified run, teacher-forced.",
            "D": "Δ(other_fact) − mean(Δ(same_fact_a), Δ(same_fact_b))",
            "localLoss": f"per-GDN-layer median over {N_QUESTIONS} questions of question-token loss / loss of the reference state; "
                         "before: S=0, prefix: all pre-question writes removed (offline), passage: passage writes "
                         "removed in that layer, A: span A writes removed in that layer",
            "control": "fixed control rule (expanded_native.py controls) applied to every triplet",
            "singleLayer": "available" if have_single else
                           "NOT RUN: the single-layer step (final31-single-layer-20260926) was not executed; "
                           "layers, localLoss and all singleLayer* fields are null",
        },
        "singleLayerRun": have_single,
        "layers": layers,
        "localLoss": local_loss,
        "triplets": triplets,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {OUT.relative_to(REPO)}: {len(triplets)} triplets, {len(layers) if layers else 0} single-layer layers")


if __name__ == "__main__":
    main()
