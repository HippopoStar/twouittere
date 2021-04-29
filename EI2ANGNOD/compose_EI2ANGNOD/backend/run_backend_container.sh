#!/bin/sh

IMAGE_NAME='ei2angnod_backend:latest'
CONTAINER_NAME='ei2angnod_backend_container'

docker stop "${CONTAINER_NAME}"
docker image rm "${IMAGE_NAME}"
docker build --tag "${IMAGE_NAME}" ./
docker run --name "${CONTAINER_NAME}" --interactive --tty --publish 8888:8888 --rm "${IMAGE_NAME}" bash

