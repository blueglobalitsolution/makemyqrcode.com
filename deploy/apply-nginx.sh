#!/usr/bin/env bash
# Apply the MakeMyQRCode nginx rules (canonical URL + asset caching).
#
#   sudo bash deploy/apply-nginx.sh
#
# The script backs up the vhost, inserts the managed snippet, validates with
# `nginx -t`, reloads, and verifies. On any failure it restores the backup.
set -euo pipefail

CONF="${CONF:-/www/server/panel/vhost/nginx/makemyqrcode.com.conf}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SNIPPET="$DIR/nginx-snippet.conf"
DOMAIN="makemyqrcode.com"

if [ "$(id -u)" -ne 0 ]; then
  echo "ERROR: root chahiye. Chalaayein:  sudo bash $0"
  exit 1
fi

# If the guessed filename is not there, find the vhost that owns the domain.
if [ ! -f "$CONF" ]; then
  echo "Config not found at $CONF - searching the vhost directory..."
  CONF="$(grep -lE "server_name[^;]*${DOMAIN}" /www/server/panel/vhost/nginx/*.conf 2>/dev/null | head -1)"
  [ -n "$CONF" ] || { echo "ERROR: no vhost file declares server_name $DOMAIN"; exit 1; }
  echo "Using: $CONF"
fi

[ -f "$SNIPPET" ] || { echo "ERROR: snippet not found: $SNIPPET"; exit 1; }

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="/root/$(basename "$CONF").${STAMP}.bak"
cp -p "$CONF" "$BACKUP"
echo "Backup saved: $BACKUP"

if ! python3 "$DIR/nginx_insert.py" "$CONF" "$SNIPPET"; then
  echo "Insert failed - config was not changed."
  exit 1
fi

if ! nginx -t; then
  echo
  echo "nginx -t FAILED - restoring the previous config."
  cp -p "$BACKUP" "$CONF"
  nginx -t && echo "Previous config restored and valid. Nothing changed."
  exit 1
fi

nginx -s reload
sleep 1

echo
echo "Verification:"
printf '  /index.html        -> '
curl -s -o /dev/null -w '%{http_code}  (want 301)\n' "https://$DOMAIN/index.html"

printf '  html cache-control -> '
curl -sI "https://$DOMAIN/" | tr -d '\r' \
  | awk -F': ' 'tolower($1)=="cache-control"{print $2; found=1} END{if(!found) print "MISSING"}'

printf '  webp cache-control -> '
curl -sI "https://$DOMAIN/images/logo/make-my-qr-code-300.webp" | tr -d '\r' \
  | awk -F': ' 'tolower($1)=="cache-control"{print $2; found=1} END{if(!found) print "MISSING"}'

printf '  webp expires       -> '
curl -sI "https://$DOMAIN/images/logo/make-my-qr-code-300.webp" | tr -d '\r' \
  | awk -F': ' 'tolower($1)=="expires"{print $2; found=1} END{if(!found) print "MISSING"}'

echo
echo "Done. Rollback if ever needed:"
echo "  cp -p $BACKUP $CONF && nginx -t && nginx -s reload"
