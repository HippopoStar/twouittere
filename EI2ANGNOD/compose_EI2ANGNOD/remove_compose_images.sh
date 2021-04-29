#!/bin/sh

CURRENT_REPOSITORY_NAME="`pwd | awk -F "/" '{ print $NF }'`"
IMAGE_NAME_PREFIX="`echo "${CURRENT_REPOSITORY_NAME}" | awk '{ print tolower($0) }'`"

FRONTEND_IMAGE_NAME="${IMAGE_NAME_PREFIX}_frontend"
BACKEND_IMAGE_NAME="${IMAGE_NAME_PREFIX}_backend"
DATABASE_IMAGE_NAME="${IMAGE_NAME_PREFIX}_database"

docker image rm "${FRONTEND_IMAGE_NAME}"
docker image rm "${BACKEND_IMAGE_NAME}"
docker image rm "${DATABASE_IMAGE_NAME}"

