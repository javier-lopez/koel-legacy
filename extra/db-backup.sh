#!/bin/sh
set -e #exit on error

mysql_id="$(docker ps | awk '/mysql/{print $1;exit;}')"

docker exec -i "${mysql_id}" rm -rf /dump
docker exec -i "${mysql_id}" backup-dbs -o /dump -z gz -u app -p app app
rm -rf /dump && docker cp "${mysql_id}":/dump /dump

mkdir -p /backups
mv /dump/app.sql.gz /backups/dump."$(date +"%d.%b.%Y.%H:%M:%S")".sql.gz

find /backups -type f -iname "*.gz" -printf "%T@ %P\n" | \
    sort -nr | awk 'NR > 120' | cut -d' ' -f 2- | xargs rm -rf

#docker cp backups/dump "${mysql_id}":/dump
#docker exec -it "${mysql_id}" mongorestore -u app -p app --db app /dump/app/
