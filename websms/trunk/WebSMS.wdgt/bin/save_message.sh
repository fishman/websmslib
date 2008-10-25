#!/bin/bash

error()
{
	echo save_message.sh: $1
}
usage()
{
	echo Usage: save_message.sh plugin filename message 
}

if [[ $1 && $2 && $3 ]]
then
	# Create message directory for plugin
	mkdir -p ~/Library/SMS/$1

	# Dump message to a textfile
	echo $3 > ~/Library/SMS/$1/$2
else
	error "Not enough arguments"
	usage
	exit 1
fi
