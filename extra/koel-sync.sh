#!/bin/sh
set -e #exit on error

app_id="$(docker ps | awk '/koel-entrypoint/{print $1;exit;}')"

docker exec -it "${app_id}" php artisan koel:sync
