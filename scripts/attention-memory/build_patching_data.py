#!/usr/bin/env python3
"""Build content/data/attention-memory-patching.json from the path-patching runs.

Usage:
  python3 scripts/attention-memory/build_patching_data.py [RESULTS_DIR]

RESULTS_DIR defaults to ~/Projects/attention-memory/olmo/results. Inputs (read only):

- path-patch-all-layer-v6ok31-20260926/{metadata.json,questions/*.json}
  (olmo/path_patch.py, all-layer mode: every GDN layer / every softmax layer at once)
- path-patch-all-layer-v6ok31-20260926-report/report.json (cross-checked, not copied)
- path-patch-single-layer-v6ok31-20260926/{metadata.json,questions/*.json}, optional:
  used only once all 93 question files are present; otherwise `singleLayer` is null.

Recovery is copied from the question files and re-derived from LD as a check:
  denoise = (LD - LD_cf) / (LD_clean - LD_cf)   (receiver: CF tokens, donor: clean run)
  noise   = (LD_clean - LD) / (LD_clean - LD_cf) (receiver: clean tokens, donor: CF run)
Q3 (other_fact) has r == r', so LD = 0 and no recovery exists; its log p(r) per row is kept.
Every mismatch aborts. Output is deterministic (sorted keys where order is not meaningful).
"""
from __future__ import annotations

import hashlib
import json
import math
import statistics
import sys
from pathlib import Path

ALL = "path-patch-all-layer-v6ok31-20260926"
REPORT = "path-patch-all-layer-v6ok31-20260926-report/report.json"
SINGLE = "path-patch-single-layer-v6ok31-20260926"
N_QUESTIONS = 93
N_TRIPLETS = 31
DIRECTIONS = ("denoise", "noise")
KINDS = ("gdn", "gdn_state_only", "attn", "both")
SINGLE_KINDS = ("gdn", "attn")
QA = ("same_fact_a", "same_fact_b")

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "content/data/attention-memory-patching.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def check(ok: bool, what: str) -> None:
    if not ok:
        sys.exit(f"consistency check failed: {what}")


def close(a: float, b: float, tol: float = 1e-9) -> bool:
    return math.isclose(a, b, rel_tol=tol, abs_tol=tol)


def quantile(values: list[float], q: float) -> float:
    """Linear interpolation between order statistics (numpy's default)."""
    s = sorted(values)
    pos = q * (len(s) - 1)
    lo = math.floor(pos)
    hi = min(lo + 1, len(s) - 1)
    return s[lo] + (s[hi] - s[lo]) * (pos - lo)


def summary(values: list[float]) -> dict:
    return {"median": statistics.median(values), "p10": quantile(values, 0.1), "p90": quantile(values, 0.9), "n": len(values)}


def load_questions(run: Path) -> list[dict]:
    files = sorted((run / "questions").glob("*.json"))
    return [json.loads(f.read_text()) for f in files]


def manifest(run: Path) -> dict:
    """One digest over every question file (name + sha256), so the source list stays short."""
    files = sorted((run / "questions").glob("*.json"))
    lines = "".join(f"{f.name} {sha256(f)}\n" for f in files)
    return {"path": f"olmo/results/{run.name}/questions/*.json", "files": len(files),
            "sha256": hashlib.sha256(lines.encode()).hexdigest(),
            "digest": "sha256 over sorted lines '<file name> <sha256>\\n'"}


def recovery_from_ld(direction: str, ld: float, clean: float, cf: float) -> float:
    return (ld - cf) / (clean - cf) if direction == "denoise" else (clean - ld) / (clean - cf)


def row_recovery(q: dict, name: str) -> float:
    row = q["rows"][name]
    direction = name.split("/")[0]
    derived = recovery_from_ld(direction, row["LD"], q["LD_clean"], q["LD_cf"])
    check(close(row["recovery"], derived), f"{q['id']} {name} recovery vs LD")
    return row["recovery"]


def main() -> None:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Projects/attention-memory/olmo/results"
    run = root / ALL
    meta = json.loads((run / "metadata.json").read_text())
    report = json.loads((root / REPORT).read_text())
    check(meta["mode"] == "all-layer" and meta["questions"] == N_QUESTIONS, "all-layer metadata")
    check(report["all_checks_pass"] is True and report["n_questions"] == N_QUESTIONS, "report checks")
    qs = load_questions(run)
    check(len(qs) == N_QUESTIONS, "93 question files")
    for q in qs:
        check(not q["failures"], f"{q['id']} failures")
        check(q["r_equals_r_prime"] == (q["role"] == "other_fact"), f"{q['id']} r == r' iff Q3")

    gdn_layers, attn_layers = meta["gdn_layers"], meta["attention_layers"]
    check(len(gdn_layers) == 24 and len(attn_layers) == 8, "24 GDN + 8 softmax layers")

    # Per question (Q1/Q2): recovery per direction / kind, all layers at once.
    questions = []
    for q in sorted((q for q in qs if q["role"] in QA), key=lambda q: (q["triplet"], q["role"])):
        rec = {d: {k: row_recovery(q, f"{d}/{k}/all") for k in KINDS} for d in DIRECTIONS}
        for d in DIRECTIONS:
            check(close(rec[d]["both"], 1.0), f"{q['id']} {d} both = 1")
            for k in KINDS:
                check(close(rec[d][k], report["recovery_per_question"][q["id"]][f"{d}/{k}/all"]), f"{q['id']} {d}/{k} vs report")
        questions.append({"id": q["id"], "triplet": q["triplet"], "title": q["title"], "role": q["role"],
                          "LD_clean": q["LD_clean"], "LD_cf": q["LD_cf"], "recovery": rec})
    check(len(questions) == 2 * N_TRIPLETS, "62 Q1/Q2 questions")

    triplet_ids = sorted({q["triplet"] for q in questions})
    check(len(triplet_ids) == N_TRIPLETS, "31 triplets")
    triplets = []
    for tid in triplet_ids:
        pair = [q for q in questions if q["triplet"] == tid]
        check([q["role"] for q in pair] == list(QA), f"{tid} has Q1 and Q2")
        rec = {d: {k: statistics.median([q["recovery"][d][k] for q in pair]) for k in KINDS} for d in DIRECTIONS}
        for d in DIRECTIONS:
            for k in KINDS:
                check(close(rec[d][k], report["recovery_per_triplet"][tid][f"{d}/{k}/all"]), f"{tid} {d}/{k} vs report")
        triplets.append({"id": tid, "title": pair[0]["title"], "recovery": rec})

    overall = {}
    for d in DIRECTIONS:
        overall[d] = {}
        for k in KINDS:
            over_q = summary([q["recovery"][d][k] for q in questions])
            over_t = statistics.median([t["recovery"][d][k] for t in triplets])
            ref = report["recovery_overall"][f"{d}/{k}/all"]
            check(close(over_q["median"], ref["median_over_questions"]) and close(over_t, ref["median_over_triplets"]), f"overall {d}/{k}")
            overall[d][k] = {"overQuestions": over_q, "medianOverTriplets": over_t}
    # gdn + attn per question: 1 when the two paths add up with no interaction.
    overall["denoiseSum"] = summary([q["recovery"]["denoise"]["gdn"] + q["recovery"]["denoise"]["attn"] for q in questions])

    # Q3 (other fact, r == r'): log p(r) per row, and its change relative to each row's receiver run.
    other = []
    for q in sorted((q for q in qs if q["role"] == "other_fact"), key=lambda q: q["triplet"]):
        clean, cf = q["rows"]["clean"]["logp_r"], q["rows"]["cf"]["logp_r"]
        logp = {d: {k: q["rows"][f"{d}/{k}/all"]["logp_r"] for k in KINDS} for d in DIRECTIONS}
        ref = report["other_fact_logp_r"][q["id"]]
        check(close(clean, ref["clean"]) and close(cf, ref["cf"]), f"{q['id']} Q3 clean/cf")
        for d in DIRECTIONS:
            for k in KINDS:
                check(close(logp[d][k], ref[f"{d}/{k}/all"]), f"{q['id']} Q3 {d}/{k}")
        base = {"denoise": cf, "noise": clean}
        other.append({"id": q["id"], "triplet": q["triplet"], "logp_clean": clean, "logp_cf": cf, "logp": logp,
                      "delta": {d: {k: logp[d][k] - base[d] for k in KINDS} for d in DIRECTIONS}})
    check(len(other) == N_TRIPLETS, "31 Q3 questions")
    other_summary = {d: {k: summary([o["delta"][d][k] for o in other]) for k in KINDS} for d in DIRECTIONS}
    other_summary["cfMinusClean"] = summary([o["logp_cf"] - o["logp_clean"] for o in other])

    sources = [
        {"path": f"olmo/results/{ALL}/metadata.json", "sha256": sha256(run / "metadata.json")},
        manifest(run),
        {"path": f"olmo/results/{REPORT}", "sha256": sha256(root / REPORT)},
    ]

    single = None
    srun = root / SINGLE
    n_single = len(list((srun / "questions").glob("*.json"))) if (srun / "questions").is_dir() else 0
    if n_single == N_QUESTIONS:
        smeta = json.loads((srun / "metadata.json").read_text())
        check(smeta["questions"] == N_QUESTIONS and smeta["gdn_layers"] == gdn_layers and smeta["attention_layers"] == attn_layers, "single metadata")
        sqs = {q["id"]: q for q in load_questions(srun)}
        layers = {"gdn": gdn_layers, "attn": attn_layers}
        per_question = []
        for q in questions:
            sq = sqs[q["id"]]
            check(not sq["failures"], f"{q['id']} single failures")
            per_question.append({"id": q["id"], "recovery": {d: {k: [row_recovery(sq, f"{d}/{k}/{L}") for L in layers[k]]
                                                                 for k in SINGLE_KINDS} for d in DIRECTIONS}})
        by_layer = {d: {k: [{"layer": L, **summary([p["recovery"][d][k][i] for p in per_question])}
                            for i, L in enumerate(layers[k])] for k in SINGLE_KINDS} for d in DIRECTIONS}
        # Sum over the single layers of one path, per question: equals the all-layer value only if layers add up.
        layer_sum = {d: {k: summary([sum(p["recovery"][d][k]) for p in per_question]) for k in SINGLE_KINDS} for d in DIRECTIONS}
        single = {"layers": layers, "byLayer": by_layer, "layerSum": layer_sum, "questions": per_question}
        sources += [{"path": f"olmo/results/{SINGLE}/metadata.json", "sha256": sha256(srun / "metadata.json")}, manifest(srun)]
    elif n_single:
        print(f"single-layer run incomplete ({n_single}/{N_QUESTIONS} question files): singleLayer = null")

    out = {
        "sources": sources,
        "notes": {
            "cohort": "31 triplets / 93 questions (counterfactuals v6 FROZEN_SELECTION_ok31); recovery for the 62 Q1/Q2 questions",
            "LD": "log p(r) - log p(r'), teacher forced, r = clean answer, r' = counterfactual answer",
            "recovery": "denoise = (LD - LD_cf)/(LD_clean - LD_cf) with CF tokens and the clean run's path patched in; "
                        "noise = (LD_clean - LD)/(LD_clean - LD_cf) with clean tokens and the CF run's path patched in",
            "kinds": "gdn: GDN recurrent state + short-conv buffers; gdn_state_only: state only; attn: softmax K/V at the changed "
                     "positions; both: gdn + attn (recovery 1 by construction, checked)",
            "triplet": "median of the triplet's Q1 and Q2",
            "otherFact": "Q3 has r == r' (LD = 0); delta = log p(r) of the patched row minus its receiver run "
                         "(denoise: CF run, noise: clean run)",
            "singleLayer": "per-layer rows {denoise,noise}/{gdn,attn}/<layer>, one layer patched at a time"
                           if single else "not available yet: singleLayer is null",
        },
        "gdnLayers": gdn_layers,
        "attnLayers": attn_layers,
        "overall": overall,
        "triplets": triplets,
        "questions": questions,
        "otherFact": {"summary": other_summary, "questions": other},
        "singleLayer": single,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {OUT.relative_to(REPO)}: {len(questions)} questions, {len(triplets)} triplets, "
          f"single-layer {'yes' if single else 'no'}")


if __name__ == "__main__":
    main()
