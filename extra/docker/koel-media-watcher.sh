#!/bin/sh
printf "%s\\n" "Running koel:sync watcher ..."

inotifywait -rme move,close_write,delete --format "%e %w%f" "${MEDIA_PATH}" | while read file; do
  php artisan koel:sync "${file}"
done
