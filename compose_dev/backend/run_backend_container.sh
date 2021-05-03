#!/bin/sh

IMAGE_NAME='dev_backend:latest'
CONTAINER_NAME='dev_backend_container'
CONTAINER_REPOSITORY_NAME='/tmp/dev_backend_container_repository'

#rm --recursive --force "${CONTAINER_REPOSITORY_NAME}"
#mkdir --parents "${CONTAINER_REPOSITORY_NAME}"
docker stop "${CONTAINER_NAME}"
docker image rm "${IMAGE_NAME}"
docker build --tag "${IMAGE_NAME}" ./
echo '`npm init --yes`'
echo '`npm install express cors body-parser fs mongodb async rxjs rxjs-compat --save`'
echo '`npm install nodemon --save-dev`'
docker run \
	--name "${CONTAINER_NAME}" \
	--interactive \
	--tty \
	--volume "${CONTAINER_REPOSITORY_NAME}:/root/TWOUITTERE/app" \
	--publish 3002:3000 \
	--rm \
	"${IMAGE_NAME}" bash

echo "sudo chown --recursive \"$(id --user):$(id --group)\" ${CONTAINER_REPOSITORY_NAME}"

echo "Voir dossier ${CONTAINER_REPOSITORY_NAME}"
echo "Ajouter au fichier 'package.json' les champs suivants :"
echo '  "name": "<app_name>",'
echo '  [...]'
echo '  "contributors": ['
echo '    {'
echo '      "name": "<your_name>",'
echo '      "email": "<your_email>"'
echo '    }'
echo '  ],'
echo '  [...]'
echo '  "engines": {'
echo '    "node": ">=14.16.1"'
echo '  },'
echo '  [...]'
echo '  "scripts": {'
echo '    "start": "node index.js",'
echo '    "dev": "nodemon index.js",'
echo '    [...]'
echo '  },'
echo '  [...]'
