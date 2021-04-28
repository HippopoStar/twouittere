#!/bin/sh

_SUDO=/usr/bin/sudo
_CHOWN=/bin/chown
_ID=/usr/bin/id

${_SUDO} ${_CHOWN} --recursive "$(${_ID} --user):$(${_ID} --group)" ./

