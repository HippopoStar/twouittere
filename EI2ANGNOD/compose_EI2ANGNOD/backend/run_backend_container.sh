#!/bin/sh

IMAGE_NAME='ei2angnod_backend:latest'
CONTAINER_NAME='ei2angnod_backend_container'
DATABASE_CONTAINER_NAME='ei2angnod_database_container'

NODE_SERVER_FILENAME='OnlineSalesServer.js'
NODE_HTTPS_SERVER_FILENAME='OnlineSalesHttpsServer.js'

docker stop "${CONTAINER_NAME}"
docker image rm "${IMAGE_NAME}"
docker build --tag "${IMAGE_NAME}" ./
echo "node ${NODE_SERVER_FILENAME} &"
echo "node ${NODE_HTTPS_SERVER_FILENAME} &"
echo 'curl -X GET localhost:8888/Products/selectors'
docker run \
	--name "${CONTAINER_NAME}" \
	--interactive \
	--tty \
	--publish 8888:8888 \
	--link "${DATABASE_CONTAINER_NAME}" \
	--rm \
	"${IMAGE_NAME}" bash

