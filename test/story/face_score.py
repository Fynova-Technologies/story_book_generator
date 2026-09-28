# Face-identity scoring with ArcFace embeddings (InsightFace buffalo_l), run by test/story/run.ts via:
#   uv run --python 3.12 --with insightface==0.7.3 --with onnxruntime --with opencv-python-headless python face_score.py <in.json>
# Input:  {"refs": [{"name", "file"}], "decoys": [file], "pages": [{"page", "file", "expected": [name]}]}
# Output (stdout): per-page matches plus per-character summary, as JSON.
import json
import sys

import cv2
import numpy as np
from insightface.app import FaceAnalysis

# InsightFace logs to stdout; keep stdout for the JSON result.
out, sys.stdout = sys.stdout, sys.stderr
app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"], allowed_modules=["detection", "recognition"])
app.prepare(ctx_id=-1, det_size=(640, 640))


def faces(path):
    image = cv2.imread(path)
    found = [f for f in app.get(image) if f.det_score > 0.5]
    if not found:  # tight face crops fill the frame and defeat the detector; pad and retry
        pad = max(image.shape[:2]) // 2
        found = [f for f in app.get(cv2.copyMakeBorder(image, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(128, 128, 128))) if f.det_score > 0.5]
    return found


def largest(path):
    found = faces(path)
    if not found:
        raise SystemExit(f"no face found in {path}")
    return max(found, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1])).normed_embedding


def cos(a, b):
    return float(np.dot(a, b))


spec = json.load(open(sys.argv[1]))
refs = {}
for ref in spec["refs"]:  # several photos of one person: average their embeddings
    refs.setdefault(ref["name"], []).append(largest(ref["file"]))
refs = {name: np.mean(embs, axis=0) / np.linalg.norm(np.mean(embs, axis=0)) for name, embs in refs.items()}
decoys = [largest(f) for f in spec["decoys"]]

pages, drawn = [], {name: [] for name in refs}
for page in spec["pages"]:
    found = faces(page["file"])
    # Greedy one-to-one assignment of expected characters to detected faces by similarity.
    pairs = sorted(((cos(refs[n], f.normed_embedding), n, i) for n in page["expected"] for i, f in enumerate(found)), reverse=True)
    taken, matches = set(), {}
    for sim, name, i in pairs:
        if name in matches or i in taken:
            continue
        emb = found[i].normed_embedding
        rivals = [cos(d, emb) for d in decoys] + [cos(refs[o], emb) for o in refs if o != name]
        matches[name] = {"similarity": round(sim, 3), "bestRival": round(max(rivals), 3) if rivals else None, "beatsRivals": not rivals or sim > max(rivals)}
        drawn[name].append(emb)
        taken.add(i)
    for name in page["expected"]:
        matches.setdefault(name, {"similarity": None, "bestRival": None, "beatsRivals": False})
    pages.append({"page": page["page"], "facesFound": len(found), "matches": matches})


def mean(xs):
    return round(float(np.mean(xs)), 3) if len(xs) else None


summary = {}
for name in refs:
    due = [p["matches"][name] for p in pages if name in p["matches"]]
    embs = drawn[name]
    pairwise = [cos(embs[i], embs[j]) for i in range(len(embs)) for j in range(i + 1, len(embs))]
    summary[name] = {
        "similarity": mean([m["similarity"] or 0 for m in due]),  # a missing face counts as 0
        "beatsRivals": mean([float(m["beatsRivals"]) for m in due]),
        "crossPage": mean(pairwise),
        "pages": len(due),
    }
json.dump({"pages": pages, "summary": summary}, out)
