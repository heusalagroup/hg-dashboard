#!/bin/bash
cd "$(dirname "$0")/.."
set -x

export DOCKER_HOST_IP=127.0.0.1
export BACKEND_JWT_SECRET='secret-code'
export BACKEND_IO_SERVER='https://app:secret@io.hg.fi'

if test -f ./prod.env; then
  . ./.prod.env
fi

docker-compose -f ./docker-compose.prod.yml up -d
