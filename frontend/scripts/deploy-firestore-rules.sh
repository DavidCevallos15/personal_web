#!/usr/bin/env bash
# Publica firebase/firestore.rules en el proyecto davidcevallos-web usando gcloud (sin firebase-tools).
# Uso: bash scripts/deploy-firestore-rules.sh
set -euo pipefail
P="${FIREBASE_PROJECT:-davidcevallos-web}"
DIR="$(cd "$(dirname "$0")/.." && pwd)"
T="$(gcloud auth print-access-token)"
H=(-H "Authorization: Bearer $T" -H "x-goog-user-project: $P" -H "Content-Type: application/json")
API="https://firebaserules.googleapis.com/v1/projects/$P"

BODY="$(node -e 'const fs=require("fs");process.stdout.write(JSON.stringify({source:{files:[{name:"firestore.rules",content:fs.readFileSync(process.argv[1],"utf8")}]}}))' "$DIR/firebase/firestore.rules")"
RULESET="$(curl -sf "${H[@]}" -X POST "$API/rulesets" -d "$BODY" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>process.stdout.write(JSON.parse(s).name))')"
echo "Ruleset: $RULESET"

REL="{\"release\":{\"name\":\"projects/$P/releases/cloud.firestore\",\"rulesetName\":\"$RULESET\"}}"
if ! curl -sf "${H[@]}" -X PATCH "$API/releases/cloud.firestore" -d "$REL" >/dev/null; then
  curl -sf "${H[@]}" -X POST "$API/releases" -d "{\"name\":\"projects/$P/releases/cloud.firestore\",\"rulesetName\":\"$RULESET\"}" >/dev/null
fi
echo "Reglas publicadas en $P"
