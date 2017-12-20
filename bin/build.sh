#!/bin/sh

set -e

if [ ! -f ".env" ]; then
    cp .env.sample .env
fi

. .env

NETWORK_NAME="cshr-net"

docker network ls | grep "$NETWORK_NAME" > /dev/null 2>&1

if [ "$?" = "1" ]; then
    docker network create --driver bridge "$NETWORK_NAME"
fi

docker-compose build app
docker-compose stop app
docker-compose rm -v -f app
