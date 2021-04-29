#!/bin/sh

IMAGE_NAME='ei2angnod_frontend:latest'
CONTAINER_NAME='ei2angnod_frontend_container'

docker stop "${CONTAINER_NAME}"
docker image rm "${IMAGE_NAME}"
docker build --tag "${IMAGE_NAME}" ./
docker run --name "${CONTAINER_NAME}" --interactive --tty --publish 4200:4200 --rm "${IMAGE_NAME}" bash

