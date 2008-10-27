#!/bin/bash
WEBSMS_PLUGIN_REPOSITORY_URL=http://tetra.emeraldion.it/websms/plugins/
error()
{
	echo suupdater.sh: $1
}
usage()
{
	echo Usage: suupdater.sh plugin_name
}

if [[ $1 ]]
then
	# Retrieve remote file
	curl ${WEBSMS_PLUGIN_REPOSITORY_URL}$1.conf.js -o plugins/$1.conf.js
else
	error "Not enough arguments"
	usage
	exit 1
fi
