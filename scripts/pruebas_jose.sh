#!/usr/bin/env bash
# Pruebas del backend de José Gaviño (RF-03 y RF-04) sobre el backend Rails.
# Uso: ./scripts/pruebas_jose.sh
set -u

BASE="${BASE:-http://127.0.0.1:3000/api/v1}"
PLAYER="${PLAYER:-2}"

# Se guarda la entrada antes de formatearla: si el backend esta caido la
# respuesta llega vacia y sin el buffer el script no imprimiria nada.
pp() {
  local cuerpo; cuerpo=$(cat)
  printf '%s' "$cuerpo" | python3 -m json.tool 2>/dev/null ||
    printf '%s\n' "${cuerpo:-(sin respuesta: ¿el backend esta levantado?)}"
}
titulo() { printf '\n\033[1;36m%s\033[0m\n' "── $1"; }

echo "=============================================================="
echo " ESPOL Quest · Backend (Ruby on Rails)"
echo " Responsable: José Gaviño — RF-03 respuestas, RF-04 misiones"
echo " Base URL: $BASE   ·   player_id de prueba: $PLAYER"
echo "=============================================================="

titulo "GET /health"
curl -s "$BASE/health" | pp

titulo "RF-04 (lectura) GET /levels/FIEC-01/missions — catálogo del nivel"
curl -s "$BASE/levels/FIEC-01/missions?player_id=$PLAYER" | pp

titulo "RF-04 (lectura) GET /missions/M-FIEC-01 — detalle con preguntas"
curl -s "$BASE/missions/M-FIEC-01" | pp

titulo "RF-03 (escritura) POST /missions/M-FIEC-01/answers — respuesta CORRECTA"
curl -s -X POST "$BASE/missions/M-FIEC-01/answers" -H 'Content-Type: application/json' \
  -d "{\"player_id\":$PLAYER,\"question_id\":1,\"selected_option\":0}" | pp

titulo "RF-03 (escritura) POST /missions/M-FIEC-01/answers — respuesta INCORRECTA"
curl -s -X POST "$BASE/missions/M-FIEC-01/answers" -H 'Content-Type: application/json' \
  -d "{\"player_id\":$PLAYER,\"question_id\":2,\"selected_option\":3}" | pp

titulo "RF-03 (escritura) Reintento correcto — completa la misión y libera la insignia"
curl -s -X POST "$BASE/missions/M-FIEC-01/answers" -H 'Content-Type: application/json' \
  -d "{\"player_id\":$PLAYER,\"question_id\":2,\"selected_option\":1}" | pp

titulo "RF-04 (lectura) Catálogo tras responder — la misión pasa a 'resuelta'"
curl -s "$BASE/levels/FIEC-01/missions?player_id=$PLAYER" | pp

titulo "Historial del jugador GET /players/$PLAYER/answers"
curl -s "$BASE/players/$PLAYER/answers" | pp

titulo "Validaciones (códigos HTTP esperados)"
printf '  misión inexistente       -> ' ; curl -s -o /dev/null -w '%{http_code} (404)\n' "$BASE/missions/M-NO-EXISTE"
printf '  opción fuera de rango    -> ' ; curl -s -o /dev/null -w '%{http_code} (422)\n' \
  -X POST "$BASE/missions/M-FIEC-01/answers" -H 'Content-Type: application/json' \
  -d "{\"player_id\":$PLAYER,\"question_id\":1,\"selected_option\":9}"
printf '  pregunta de otra misión  -> ' ; curl -s -o /dev/null -w '%{http_code} (422)\n' \
  -X POST "$BASE/missions/M-FIEC-01/answers" -H 'Content-Type: application/json' \
  -d "{\"player_id\":$PLAYER,\"question_id\":3,\"selected_option\":1}"
printf '  jugador inexistente      -> ' ; curl -s -o /dev/null -w '%{http_code} (404)\n' \
  -X POST "$BASE/missions/M-FIEC-01/answers" -H 'Content-Type: application/json' \
  -d '{"player_id":9999,"question_id":1,"selected_option":0}'
printf '  campos faltantes         -> ' ; curl -s -o /dev/null -w '%{http_code} (400)\n' \
  -X POST "$BASE/missions/M-FIEC-01/answers" -H 'Content-Type: application/json' -d '{}'

echo
echo "Pruebas de José Gaviño finalizadas."
