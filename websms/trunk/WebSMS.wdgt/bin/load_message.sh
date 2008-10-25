#!/bin/bash

error()
{
	echo load_message.sh: $1
}
usage()
{
	echo Usage: load_message.sh plugin filename
}

if [[ $1 && $2 ]]
then
	# Dump message
	cat ~/Library/SMS/$1/$2
else
	error "Not enough arguments"
	usage
	exit 1
fi
