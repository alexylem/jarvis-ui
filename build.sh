#!/bin/bash
printf "Updating version number..."
    version=$(date +"%y%m%d%H%M%S")
    sed -i '' -E "s/\?v=[0-9]+/\?v=$version/g" index.html
    echo -e "\033[92mDone\033[0m"
printf "Opening GitHub Desktop..."
    open -a "GitHub Desktop" /Users/alex/Documents/jarvis-ui
    echo -e "\033[92mDone\033[0m"
