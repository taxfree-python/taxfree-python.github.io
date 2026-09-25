#!/usr/bin/env python3
"""Build content/data/attention-memory-card.json from the frozen v6 counterfactual triplets.

Usage:
  python3 scripts/attention-memory/build_card_data.py [COUNTERFACTUALS_JSON] [FROZEN_SELECTION_JSON]

Both source files are read-only; this script never writes to them. FROZEN_SELECTION_JSON
lists the 31 triplet ids kept after judgment filtering (rule 12: judgment == "ok"), in an
order already sorted by article title then paragraph number -- that order is preserved
verbatim in the output. Every other field is copied from COUNTERFACTUALS_JSON; nothing is
inferred except the human-readable title (article title with underscores turned to spaces)
and the SQuAD explorer URL built from it. Consistency checks abort the build on mismatch.

- COUNTERFACTUALS_JSON  per-triplet span A / substitute / mention-edit / question records
                         (counterfactuals/v6/counterfactuals.json)
- FROZEN_SELECTION_JSON the frozen list of 31 triplet ids, with counterfactuals.json's own
                         sha256 recorded at freeze time (FROZEN_SELECTION_ok31.json)
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROLE_ORDER = ("same_fact_a", "same_fact_b", "other_fact")
VALID_TYPES = {"PER", "DAT", "NUM", "ORG"}

SCRATCH = Path("/private/tmp/claude-501/-Users-yuchinen/2282bc2a-adb7-42fa-8a40-e5118a0126fd/scratchpad/counterfactuals/v6")
DEFAULT_COUNTERFACTUALS = SCRATCH / "counterfactuals.json"
DEFAULT_SELECTION = SCRATCH / "FROZEN_SELECTION_ok31.json"

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "content/data/attention-memory-card.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def check(ok: bool, what: str) -> None:
    if not ok:
        sys.exit(f"consistency check failed: {what}")


def source_url(title: str) -> str:
    return f"https://rajpurkar.github.io/SQuAD-explorer/explore/1.1/dev/{title}.html"


def main() -> None:
    cf_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_COUNTERFACTUALS
    sel_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_SELECTION

    selection = json.loads(sel_path.read_text())
    cf_hash = sha256(cf_path)
    check(cf_hash == selection["source_sha256"], f"counterfactuals.json sha256 mismatch: {cf_hash} != {selection['source_sha256']}")

    counterfactuals = json.loads(cf_path.read_text())
    by_id = {t["triplet_id"]: t for t in counterfactuals["triplets"]}

    ids = selection["triplet_ids"]
    check(len(ids) == selection["n_triplets"], "n_triplets matches triplet_ids length")
    check(len(set(ids)) == len(ids), "triplet_ids has no duplicates")
    check(ids == sorted(ids, key=lambda tid: (by_id[tid]["title"], by_id[tid]["paragraph"])),
          "triplet_ids is already sorted by article title then paragraph number")

    triplets = []
    n_questions = 0
    for tid in ids:
        check(tid in by_id, f"{tid} present in counterfactuals.json")
        t = by_id[tid]
        check(t["judgment"]["label"] == "ok", f"{tid} judgment is ok")
        check(t["type"] in VALID_TYPES, f"{tid} type is one of {VALID_TYPES}")

        passage = t["clean_passage"]
        span_start, span_end = t["span_a"]["char_interval"]
        check(passage[span_start:span_end] == t["span_a"]["text"], f"{tid} span_a offsets match its text")

        other_mentions = []
        for edit in t["mention_edits"]:
            m_start, m_end = edit["char_interval"]
            check(passage[m_start:m_end] == edit["old"], f"{tid} mention_edit offsets match its text")
            other_mentions.append({"text": edit["old"], "start": m_start, "end": m_end, "replacement": edit["new"]})

        by_role = {p["role"]: p for p in t["prompts"] if p["role"] in ROLE_ORDER}
        check(set(by_role) == set(ROLE_ORDER), f"{tid} has same_fact_a/same_fact_b/other_fact questions")
        questions = []
        for role in ROLE_ORDER:
            p = by_role[role]
            if role == "other_fact":
                check(p["answer_clean"] == p["answer_cf"], f"{tid} other_fact answer is unaffected by the replacement")
            else:
                check(p["answer_clean"] == t["span_a"]["text"], f"{tid} {role} answer equals span A")
            questions.append({"role": role, "question": p["question"], "answer": p["answer_clean"]})
        n_questions += len(questions)

        triplets.append({
            "id": tid,
            "title": t["title"].replace("_", " "),
            "paragraph": t["paragraph"],
            "sourceUrl": source_url(t["title"]),
            "passage": passage,
            "spanA": {"text": t["span_a"]["text"], "start": span_start, "end": span_end},
            "replacement": {"text": t["substitute"]["text"]},
            "otherMentions": other_mentions,
            "type": t["type"],
            "questions": questions,
        })

    check(n_questions == selection["n_questions"], f"question count matches selection meta ({n_questions} vs {selection['n_questions']})")

    out = {
        "meta": {
            "description": "Frozen v6 counterfactual fact triplets (judgment == \"ok\") for the attention-memory 'triplets' card.",
            "source": {"path": str(cf_path), "sha256": cf_hash},
            "selection": {"path": str(sel_path), "sha256": sha256(sel_path)},
            "rule": selection["rule"],
            "order": "triplet_ids order from FROZEN_SELECTION_ok31.json, already sorted by article title then paragraph number",
        },
        "triplets": triplets,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {OUT.relative_to(REPO)}: {len(triplets)} triplets, {n_questions} questions")


if __name__ == "__main__":
    main()
