#!/bin/bash

FRONTEND_REPOSITORY='./frontend/app'
BACKEND_REPOSITORY='./backend/app'

HTML_FILES="`find ${FRONTEND_REPOSITORY} \( -type f -a -name *.html \) -print`"
CSS_FILES="`find ${FRONTEND_REPOSITORY} \( -type f -a -name *.css \) -print`"
TS_FILES="`find ${FRONTEND_REPOSITORY} \( -type f -a -name *.ts \) -print`"
JS_FILES="`find ${BACKEND_REPOSITORY} \( -type f -a -path ${BACKEND_REPOSITORY}/*.js \) -print`"

#echo '----- HTML FILES -----'
#echo "${HTML_FILES}"
#
#echo '----- CSS FILES -----'
#echo "${CSS_FILES}"
#
#echo '----- TS FILES -----'
#echo "${TS_FILES}"
#
#echo '----- JS FILES -----'
#echo "${JS_FILES}"

detect_beginning_by_space_lines () {
	if [ ${#} -eq 1 -a \( -e "${1}" -a -f "${1}" \) ] ; then
		echo "${1}"
		cat "${1}" | awk '/^ / { print "|\t" NR ": " $0 }; /^[ \t]+$/ { print "|\t" NR ": " $0 }'
	fi
}

export -f detect_beginning_by_space_lines

detect_beginning_by_tabulation_lines () {
	if [ ${#} -eq 1 -a \( -e "${1}" -a -f "${1}" \) ] ; then
		echo "${1}"
		cat "${1}" | awk '/^\t/ { print "|\t" NR ": " $0 }; /^[ \t]+$/ { print "|\t" NR ": " $0 }'
	fi
}

export -f detect_beginning_by_tabulation_lines

echo '----- HTML FILES -----'
echo "${HTML_FILES}" | awk '{ print "detect_beginning_by_space_lines " $0 }' | bash -s
echo '----- CSS FILES -----'
echo "${CSS_FILES}" | awk '{ print "detect_beginning_by_space_lines " $0 }' | bash -s
echo '----- TS FILES -----'
echo "${TS_FILES}" | awk '{ print "detect_beginning_by_tabulation_lines " $0 }' | bash -s
echo '----- JS FILES -----'
echo "${JS_FILES}" | awk '{ print "detect_beginning_by_tabulation_lines " $0 }' | bash -s

