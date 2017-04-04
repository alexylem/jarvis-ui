#!/bin/bash
# Here you can create functions which will be available from the commands file
# You can also use here user variables defined in your config file
# To avoid conflicts, name your function like this
# jv_pg_XX_myfunction () { }
# jv for JarVis
# pg for PluGin
# XX can be a two letters code for your plugin, ex: ww for Weather Wunderground

jv_pg_ui_myip () {
    /sbin/ifconfig | sed -En 's/127.0.0.1//;s/.*inet (ad[d]?r:)?(([0-9]*\.){3}[0-9]*).*/\2/p'
}

jv_pg_ui_start () {
    jv_debug "Starting User Interface on http://$(jv_pg_ui_myip):$jv_pg_ui_port"
    local previous_dir="$(pwd)"
    local current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    cd $current_dir/../
    nohup python -m SimpleHTTPServer $jv_pg_ui_port >/dev/null 2>/dev/stdout & 
    cd $previous_dir
}

# do not start http server if just executing an order
[ "$just_execute" == false ] && jv_pg_ui_start
