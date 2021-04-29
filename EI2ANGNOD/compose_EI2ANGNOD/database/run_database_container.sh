#!/bin/sh

usage () {
	echo "${0} run|show"
}

IMAGE_NAME='ei2angnod_database:latest'
CONTAINER_NAME='ei2angnod_database_container'

show_collection () {
	if [ ${#} -eq 2 ] ; then # [ expression ] : '[' etant un nom fonction, les espaces autour sont importants
		echo "Database '${1}' - Collection '${2}':"
		docker exec "${CONTAINER_NAME}" sh -c "exec mongoexport --pretty --db '${1}' --collection '${2}'"
	fi
}

if [ ${#} -ne 1 -o \( 'xrun' != "x${1}" -a 'xshow' != "x${1}" \) ] ; then
	usage # pas de parentheses quand on appelle la fonction
else
	if [ 'xrun' = "x${1}" ] ; then

		docker stop "${CONTAINER_NAME}"
		docker image rm "${IMAGE_NAME}"
		docker build --tag "${IMAGE_NAME}" ./

		docker run --name "${CONTAINER_NAME}" --detach --publish 27017:27017 --rm "${IMAGE_NAME}"
		#docker exec --interactive --tty "${CONTAINER_NAME}" bash

	elif [ 'xshow' = "x${1}" ] ; then

		DATABASE_NAME='OnlineSales'
		show_collection "${DATABASE_NAME}" Users
		show_collection "${DATABASE_NAME}" Products
		show_collection "${DATABASE_NAME}" Carts

	fi
fi

