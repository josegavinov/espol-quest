#!/usr/bin/env bash
# Pruebas del backend de Kevin Gálvez (RF-01 y RF-02) sobre el backend Rails.
# Uso: ./scripts/pruebas_kevin.sh
set -u

BASE="${BASE:-http://127.0.0.1:3000/api/v1}"

pp() { python3 -m json.tool 2>/dev/null || cat; }
titulo() { printf '\n\033[1;36m%s\033[0m\n' "── $1"; }

echo "=============================================================="
echo " ESPOL Quest · Backend (Ruby on Rails)"
echo " Responsable: Kevin Gálvez — RF-01 escenario/físicas, RF-02 selector"
echo " Base URL: $BASE"
echo "=============================================================="

titulo "GET /health"
curl -s "$BASE/health" | pp

titulo "RF-02 (lectura) GET /levels — selector de niveles"
curl -s "$BASE/levels" | pp

titulo "RF-02 (lectura) GET /levels?zona=FIEC — filtrado por zona"
curl -s "$BASE/levels?zona=FIEC" | pp

titulo "RF-01 (lectura) GET /levels/FIEC-01 — escenario, físicas y checkpoints"
curl -s "$BASE/levels/FIEC-01" | pp

titulo "RF-01 (escritura) POST /levels/FIEC-01/state — guarda estado del avatar"
curl -s -X POST "$BASE/levels/FIEC-01/state" \
  -H 'Content-Type: application/json' \
  -d '{"player_id":1,"avatar":{"x":1180,"y":600},"lives":2,"elapsed_seconds":95,
       "checkpoints_reached":["FIEC-01-CP1","FIEC-01-CP2"]}' | pp

titulo "RF-01 (lectura) GET /levels/FIEC-01/state?player_id=1 — reanudar partida"
curl -s "$BASE/levels/FIEC-01/state?player_id=1" | pp

titulo "Validaciones (códigos HTTP esperados)"
printf '  nivel inexistente        -> ' ; curl -s -o /dev/null -w '%{http_code} (404)\n' "$BASE/levels/XXX-99"
printf '  checkpoint invalido      -> ' ; curl -s -o /dev/null -w '%{http_code} (422)\n' \
  -X POST "$BASE/levels/FIEC-01/state" -H 'Content-Type: application/json' \
  -d '{"player_id":1,"checkpoints_reached":["NO-EXISTE"]}'
printf '  sin player_id            -> ' ; curl -s -o /dev/null -w '%{http_code} (400)\n' \
  -X POST "$BASE/levels/FIEC-01/state" -H 'Content-Type: application/json' -d '{}'

echo
echo "Pruebas de Kevin Gálvez finalizadas."
