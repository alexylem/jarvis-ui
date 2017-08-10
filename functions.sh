jv_pg_ui_start () {
    if jv_plugin_is_enabled "jarvis-api"; then
        jv_debug "Starting User Interface on http://$jv_ip:$jv_pg_ui_port"
        cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
        nohup python2 -m SimpleHTTPServer $jv_pg_ui_port >/dev/null 2>/dev/stdout & 
        cd $jv_dir
    else
        jv_error "ERROR: Jarvis-UI requires Jarvis-API plugin to be installed and enabled"
        return 1
    fi
}
