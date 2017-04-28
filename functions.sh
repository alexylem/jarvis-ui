jv_pg_ui_start () {
    jv_debug "Starting User Interface on http://$jv_ip:$jv_pg_ui_port"
    local previous_dir="$(pwd)"
    local current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    cd $current_dir/../
    nohup python -m SimpleHTTPServer $jv_pg_ui_port >/dev/null 2>/dev/stdout & 
    cd $previous_dir
}
