#!/bin/sh

IMAGE_NAME='dev_frontend:latest'
CONTAINER_NAME='dev_frontend_container'
CONTAINER_REPOSITORY_NAME='/tmp/dev_frontend_container_repository'

rm --recursive --force "${CONTAINER_REPOSITORY_NAME}"
mkdir --parents "${CONTAINER_REPOSITORY_NAME}"
docker stop "${CONTAINER_NAME}"
docker image rm "${IMAGE_NAME}"
docker build --tag "${IMAGE_NAME}" ./
echo 'Do not forget to adapt backend_server_url variable in app/auth.service.ts !'
echo '`ng build --prod --bh twouittere`'
echo '`cp --recursive ./twouittere /root/export/`'
docker run \
	--name "${CONTAINER_NAME}" \
	--interactive \
	--tty \
	--volume "$(pwd)/app:/root/angular/TWOUITTERE/src/app" \
	--volume "${CONTAINER_REPOSITORY_NAME}:/root/export" \
	--publish 4202:4000 \
	--rm \
	"${IMAGE_NAME}" bash

echo "sudo chown --recursive \"$(id --user):$(id --group)\" ${CONTAINER_REPOSITORY_NAME}"

