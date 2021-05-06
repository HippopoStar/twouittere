#!/bin/bash

DOCKER_VOLUMES="`docker volume ls`"

remove_volume () {
	if [ ${#} -eq 1 ] ; then
		if [ `echo "${1}" | wc --chars` -eq 65 ] ; then
			docker volume rm "${1}"
		else
			echo "Keeping ${1}"
		fi
	fi
}

export -f remove_volume

echo "${DOCKER_VOLUMES}" | awk 'NR > 1 { print "remove_volume " $2 }' | bash -s

docker volume ls

echo 'Too see docker s volumes along with their respective disk usage, run `sudo ls --size --human-readable --format=single-column /var/lib/docker/volumes/`'

