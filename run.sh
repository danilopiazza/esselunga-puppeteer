#!/bin/sh
while true
do
  LOG_LEVEL=debug timeout 30 node index.js
  sleep 600
done
