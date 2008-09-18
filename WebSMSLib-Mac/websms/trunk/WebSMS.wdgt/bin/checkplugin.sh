#!/bin/bash
WEBSMS_PLUGIN_REPOSITORY_URL=http://tetra.emeraldion.it/websms/plugins/
error()
{
	echo checkplugin.sh: $1
}
usage()
{
	echo Usage: checkplugin.sh plugin_name
}

if [[ $1 ]]
then
	# Retrieve remote file
	/usr/bin/curl -s ${WEBSMS_PLUGIN_REPOSITORY_URL}$1.conf.js | /usr/bin/grep version:
else
	error "Not enough arguments"
	usage
	exit 1
fi
