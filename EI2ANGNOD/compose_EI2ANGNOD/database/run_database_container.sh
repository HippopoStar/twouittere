#!/bin/sh

usage () {
	echo "${0} run|show"
}

IMAGE_NAME='ei2angnod_database:latest'
CONTAINER_NAME='ei2angnod_database_container'

show_collection () {
	if [ ${#} -eq 2 ] ; then # [ expression ] : '[' etant un nom fonction, les espaces autour sont importants
		echo "Database '${1}' - Collection '${2}':"
		docker exec \
			"${CONTAINER_NAME}" sh -c "exec mongoexport --uri=\"mongodb://root:example@127.0.0.1:27017/${1}?authSource=admin\" --pretty --collection '${2}'"
#			"${CONTAINER_NAME}" sh -c "exec mongoexport --username='root' --password='example' --pretty --db '${1}' --collection '${2}'"

	fi
}

if [ ${#} -ne 1 -o \( 'xrun' != "x${1}" -a 'xshow' != "x${1}" \) ] ; then # Les parentheses doivent etre echappees pour que cela fonctionne
	usage # pas de parentheses quand on appelle la fonction
else
	if [ 'xrun' = "x${1}" ] ; then

		docker stop "${CONTAINER_NAME}"
		docker image rm "${IMAGE_NAME}"
		docker build --tag "${IMAGE_NAME}" ./

		docker run \
			--name "${CONTAINER_NAME}" \
			--interactive \
			--tty \
			--env MONGO_INITDB_ROOT_USERNAME=root \
			--env MONGO_INITDB_ROOT_PASSWORD=example \
			--publish 27017:27017 \
			--rm \
			"${IMAGE_NAME}"

#			--detach \
#			--interactive \
#			--tty \

#			--env MONGO_INITDB_ROOT_USERNAME=root \
#			--env MONGO_INITDB_ROOT_PASSWORD=example \

	elif [ 'xshow' = "x${1}" ] ; then

		DATABASE_NAME='OnlineSales'
		show_collection "${DATABASE_NAME}" Users
		show_collection "${DATABASE_NAME}" Products
		show_collection "${DATABASE_NAME}" Carts

	fi
fi

