#!/usr/bin/env bash
# Pruebas del backend de Jorge del Campo (RF-05 y RF-06) sobre el servicio Rails.
# Uso: ./scripts/pruebas_jorge.sh
set -u

BASE="${BASE:-http://127.0.0.1:3000/api/v1}"

pp() { python3 -m json.tool 2>/dev/null || cat; }
titulo() { printf '\n\033[1;36m%s\033[0m\n' "── $1"; }

echo "=============================================================="
echo " ESPOL Quest · Servicio de Administración y Ranking (Rails)"
echo " Responsable: Jorge del Campo — RF-05 progreso/insignias, RF-06 ranking"
echo " Base URL: $BASE"
echo "=============================================================="

titulo "GET /health"
curl -s "$BASE/health" | pp

titulo "Catálogo GET /badges — insignias disponibles"
curl -s "$BASE/badges" | pp

titulo "RF-05 (escritura) POST /progress — registra nivel superado e insignias"
curl -s -X POST "$BASE/progress" -H 'Content-Type: application/json' \
  -d '{"player_id":2,"nickname":"jose_g","facultad":"FIEC","level_code":"FIEC-01",
       "score":20,"exploration_pct":100,"missions_completed":1,"completed":true,
       "badges":["insignia_fiec","insignia_novato"]}' | pp

titulo "RF-05 (escritura) POST /progress — segundo nivel del mismo jugador"
curl -s -X POST "$BASE/progress" -H 'Content-Type: application/json' \
  -d '{"player_id":2,"level_code":"BIB-01","score":30,"exploration_pct":100,
       "missions_completed":1,"completed":true,"badges":["insignia_lector"]}' | pp

titulo "RF-05 (escritura) Reenvío con menor puntaje — se conserva el mejor intento"
curl -s -X POST "$BASE/progress" -H 'Content-Type: application/json' \
  -d '{"player_id":2,"level_code":"BIB-01","score":5,"exploration_pct":40}' | pp

titulo "RF-05 (lectura) GET /progress/2 — perfil de progreso del jugador"
curl -s "$BASE/progress/2" | pp

titulo "RF-06 (lectura) GET /ranking — tabla de clasificación global"
curl -s "$BASE/ranking" | pp

titulo "RF-06 (lectura) GET /ranking?facultad=FIEC — ranking filtrado por facultad"
curl -s "$BASE/ranking?facultad=FIEC" | pp

titulo "RF-06 (lectura) GET /ranking?limit=2 — top 2"
curl -s "$BASE/ranking?limit=2" | pp

titulo "Validaciones (códigos HTTP esperados)"
printf '  falta level_code         -> ' ; curl -s -o /dev/null -w '%{http_code} (400)\n' \
  -X POST "$BASE/progress" -H 'Content-Type: application/json' -d '{"player_id":2}'
printf '  facultad invalida        -> ' ; curl -s -o /dev/null -w '%{http_code} (422)\n' \
  -X POST "$BASE/progress" -H 'Content-Type: application/json' \
  -d '{"player_id":77,"nickname":"x","facultad":"XXX","level_code":"BIB-01"}'
printf '  perfil inexistente       -> ' ; curl -s -o /dev/null -w '%{http_code} (404)\n' "$BASE/progress/9999"

echo
echo "Pruebas de Jorge del Campo finalizadas."
