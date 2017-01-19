#! /bin/sh
# -----------------------------------------------------------------
# Description  : Script to run commands
# Author       : Naresh Shan <naree@outfitpic.com>
# Version      : $Id$
# Copyright    : (c) 2015 by Outfirpic
#                All rights reserved
# -----------------------------------------------------------------

# -----------------------------------------------------------------------------
# Configuration variables
# adjust following variables!!!
#
NPM_INSTALL_DIR="/usr/local/bin";
BASE_DIR="."
BASE_DIR_ABS=$(pwd)



# Name of the web application
APP_NAME=Outfitpic_1.1

# Cordova
CORDOVA_VERSION=5.3.3

# Plugins (one per line)
PLUGINS="cordova-plugin-file
cordova-plugin-camera
cordova-plugin-device
cordova-plugin-console
ionic-plugin-keyboard
cordova-plugin-inappbrowser
cordova-plugin-network-information
cordova-plugin-transport-security
cordova-plugin-whitelist
ionic-plugin-keyboard
cordova-plugin-splashscreen
cordova-plugin-x-socialsharing
de.appplant.cordova.plugin.local-notification
cordova-plugin-splashscreen
cordova-plugin-file
cordova-plugin-dialogs
pushwoosh-cordova-plugin

"

# -----------------------------------------------------------------------------
# no user maintainable parts here below... ;-)

# The home directory of the web application
APP_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

APP_VERSION=`xmllint --xpath "string(//*[local-name()='widget']/@version)" config.xml`

# iOS bin dir
IOS_BIN_DIR="$BASE_DIR/platforms/ios/cordova"

# iOS bin files (one per line)
IOS_BIN_FILES="build
build-debug.xcconfig
build-release.xcconfig
build.xcconfig
clean
log
run
version
apple_xcode_version
lib/*"

# Android bin dir
ANDROID_BIN_DIR="$BASE_DIR/platforms/android/cordova"

# Android bin files (one per line)
ANDROID_BIN_FILES="build
clean
log
run
version"



function logo {
	echo '                                                                 '
	echo '*****************************************************************'
	echo '                                                     			   '
	echo '	   ___          _     __  _  _           _         _     _     '
	echo '	  / _ \  _   _ | |_  / _|(_)| |_  _ __  (_)  ___  / |   / |    '
	echo "	 | | | || | | || __|| |_ | || __|| '_ \ | | / __| | |   | |    "
	echo '	 | |_| || |_| || |_ |  _|| || |_ | |_) || || (__  | | _ | |    '
	echo '	  \___/  \__,_| \__||_|  |_| \__|| .__/ |_| \___| |_|(_)|_|    '
    echo '		                     |_|                                   '
	echo '                                                                 '
	echo '                         Apache Cordova Dev Environment (C) 2015 '
	echo '*****************************************************************'
	echo "$APP_NAME $APP_VERSION service tool"
	echo '*****************************************************************'
}

function usage {
  echo 'Usage: '
  echo "$0 init                - creates the platform and plugin directory"
  echo "$0 remove-plugins      - removes all cordova plugins"
  echo "$0 update-cordova      - updates the cordova framework"
  echo "$0 update-dependencies - updates the project node and bower dependencies"
  echo "$0 renew               - updates everything"
  echo "$0 updatePlugins       - update plugins from cordova and do bower install / npm install"
  echo "$0 version             - prints the current version"

  echo "\n\n ------- CHECK IF CORRECT:"
  echo "Source base directory is set to: $BASE_DIR_ABS"
  echo " -------------------------"
}

function init {
	echo 'installing platforms...'
	rmdir "platforms"
	mkdir -p "platforms"

	# ios
	$NPM_INSTALL_DIR/cordova platform add ios
	for file in $IOS_BIN_FILES
	do
		chmod 755 $IOS_BIN_DIR/$file
	done

	# android
	$NPM_INSTALL_DIR/cordova platform add android
	for file in $ANDROID_BIN_FILES
	do
		chmod 755 $ANDROID_BIN_DIR/$file
	done

	# android custom files
	for file in `ls platforms.custom/android`
	do
		if [ ! -f platforms/android/$file ]; then
			ln -s ../../platforms.custom/android/$file platforms/android/$file
		fi
	done

	echo 'installing plugins...'
	mkdir -p "plugins"
	for plugin in $PLUGINS
	do
		$NPM_INSTALL_DIR/cordova plugin add $plugin
	done

	echo 'INIT DONE'
}

function removeAllCordovaPlugins {
	echo 'removing all cordova plugins...'
	for i in `$NPM_INSTALL_DIR/cordova plugin ls | grep '^[^ ]*' -o`
	do $NPM_INSTALL_DIR/cordova plugin rm $i
	done
	echo 'REMOVE PLUGINS DONE'
}

function updateCordova {
	echo 'updating cordova ...'
	removeAllCordovaPlugins
    $NPM_INSTALL_DIR/cordova platform remove android
    $NPM_INSTALL_DIR/cordova platform remove ios
	# sudo npm install -g cordova@$CORDOVA_VERSION
	sudo $NPM_INSTALL_DIR/npm update -g cordova
	init
	$NPM_INSTALL_DIR/cordova build android
    $NPM_INSTALL_DIR/cordova build ios
	echo 'UPDATE CORDOVA DONE'
}

function renewEverything {
	echo 'deleting platforms and plugins ...'
	rm -r plugins
	rm -r platforms
	echo 'updating cordova ...'
	# sudo npm install -g cordova@$CORDOVA_VERSION
	sudo $NPM_INSTALL_DIR/npm update -g cordova
	updateDependencies
	init
	$NPM_INSTALL_DIR/cordova build android
    $NPM_INSTALL_DIR/cordova build ios
	echo 'RENEW DONE'
}

function updateDependencies {
	echo 'updating project dependencies ...'
	$NPM_INSTALL_DIR/npm install
	$NPM_INSTALL_DIR/bower install
	echo 'UPDATE DEPENDENCIES DONE'
}


function updatePlugins {
	echo 'update plugins...'
	for plugin in $PLUGINS
	do
		echo 'add' $plugin
		$NPM_INSTALL_DIR/cordova plugin add $plugin
	done
	updateDependencies
}

if [[ -z "$1" ]]; then
	logo
  	usage
	exit
fi

if [ "$1" == "version" ]; then
  	echo $APP_VERSION
  	exit
fi

logo

if [ "$1" == "init" ]
then
	init
else
  usage
fi

if [ "$1" == "remove-plugins" ]
then
	removeAllCordovaPlugins
fi

if [ "$1" == "update-cordova" ]
then
	updateCordova
fi

if [ "$1" == "renew" ]
then
	renewEverything
fi

if [ "$1" == "update-dependencies" ]
then
	updateDependencies
fi

if [ "$1" == "updatePlugins" ]
then
	updatePlugins
fi

echo "exit $APP_NAME tool"
