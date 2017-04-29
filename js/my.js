// Log levels
my.loglevel = 4;
Ractive.DEBUG = (my.log_level >= 4);

// Global variables
var themes = {
    slate: "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/slate/bootstrap.min.css",
    default: "css/light.css"
};
var themesheet = $('<link href="" rel="stylesheet" />');
var commmands_cm, events_cm;
var recognition;
var start_recording;

var ractive = new Ractive({
    // The `el` option can be a node, an ID, or a CSS selector.
    el: '#container',
    
    // We could pass in a string, but for the sake of convenience
    // we're passing the ID of the <script> tag above.
    template: '#template',
    
    // Here, we're passing in some initial data
    data: {
        loading: true,
        stt_supported: false,
        stt_state: "loading",
        stt_icons: {
            loading: "fa-spinner rotate",
            ready: "fa-microphone",
            error: "fa-microphone-slash",
            recording: "fa-stop-circle-o"
        },
        placeholder: "Type something...",
        order: "",
        interim_order: "",
        messages: [],
        config_tabs: [{
            key: "general",
            label: "General",
            fields: [{
                key: "language",
                label: "Language",
                type: "select",
                help: "Language of Jarvis",
                options: [
                    { value:'en_GB', label:'English' },
                    { value:'es_ES', label:'Español' },
                    { value:'fr_FR', label:'Français' },
                    { value:'it_IT', label:'Italiano' },
                    { value:'pt_PT', label:'Português' }
                ]
            },{
                key: "username",
                label: "Username",
                type: "text",
                placeholder: "ex: Alex",
                help: "How do you want to be called"
            },{
                key: "trigger",
                label: "Magic word",
                type: "text",
                placeholder: "ex: Jarvis",
                help: "Magic word to be said (Jarvis name)"
            },{
                key: "show_commands",
                label: "Show possible commands",
                type: "checkbox",
                help: "Show commands on startup and possible answers"
            },{
                key: "conversation_mode",
                label: "Conversation mode",
                type: "checkbox",
                help: "Wait for another command after first executed"
            },{
                key: "separator",
                label: "Multi-command separator",
                type: "text",
                placeholder: "ex: then",
                help: "Separator for multiple commands at once. Empty to disable"
            },{
                key: "check_updates",
                label: "Check updates",
                type: "select",
                help: "Check Updates when Jarvis starts up",
                options: [
                    { value:'0', label:'Always' },
                    { value:'1', label:'Daily - Recommended' },
                    { value:'7', label:'Weekly' },
                    { value:'false', label:'Never' }
                ]
            }]
        },{
            key: "phrases",
            label: "Phrases",
            fields: [{
                key: "phrase_welcome",
                label: "Startup greetings",
                type: "text",
                placeholder: "ex: Hello",
                help: "What to say at program startup"
            },{
                key: "phrase_triggered",
                label: "Trigger reply",
                type: "text",
                placeholder: "ex: Yes?",
                help: "What to say when magic word is heard"
            },{
                key: "phrase_misunderstood",
                label: "Unknown order",
                type: "text",
                placeholder: "ex: I did not understand",
                help: "What to say if order not recognized"
            },{
                key: "phrase_failed",
                label: "Command failed",
                type: "text",
                placeholder: "ex: This command has returned an error",
                help: "What to say if user command failed"
            }]
        },{
            key: "audio",
            label: "Audio",
            fields: [{
                key: "play_hw",
                label: "Speaker",
                type: "text",
                placeholder: "ex: hw:1,0",
                help: ""
            },{
                key: "rec_hw",
                label: "Microphone",
                type: "text",
                placeholder: "ex: hw:1,0",
                help: ""
            },{
                key: "min_noise_duration_to_start",
                label: "Min noise duration to start",
                type: "text",
                placeholder: "ex: 0.1",
                help: ""
            },{
                key: "min_noise_perc_to_start",
                label: "Min noise percentage to start",
                type: "text",
                placeholder: "ex: 1%",
                help: ""
            },{
                key: "min_silence_duration_to_stop",
                label: "Min silence duration to stop",
                type: "text",
                placeholder: "ex: 0.5",
                help: ""
            },{
                key: "min_silence_level_to_stop",
                label: "Min silence level to stop",
                type: "text",
                placeholder: "ex: 1%",
                help: ""
            }]
        },{
            key: "stt",
            label: "Voice recognition",
            fields: [{
                key: "trigger_stt",
                label: "Recognition of magic word",
                type: "select",
                help: "Which engine to use for the recognition of the trigger. Visit http://domotiquefacile.fr/jarvis/content/stt",
                options: [
                    { value:'snowboy', label:'Snowboy (offline) - Recommended' },
                    { value:'pocketsphinx', label:'PocketSphinx (offline)' },
                    { value:'bing', label:'Bing (online)' }
                ]
            },{
                key: "command_stt",
                label: "Recognition of commands",
                type: "select",
                help: "Which engine to use for the recognition of commands. Visit http://domotiquefacile.fr/jarvis/content/stt",
                options: [
                    { value:'bing', label:'Bing (online) - Recommended' },
                    { value:'wit', label:'Wit.ai (online)' },
                    { value:'snowboy', label:'Snowboy (offline)' },
                    { value:'pocketsphinx', label:'PocketSphinx (offline)' },    
                ]
            },{
                key: "snowboy_sensitivity",
                label: "Snowboy sensitivity",
                type: "text",
                placeholder: "ex: 0.5",
                help: "Snowboy sensitivity from 0 (strict) to 1 (permissive). Recommended value: 0.5"
            },{
                key: "snowboy_token",
                label: "Snowboy token",
                type: "text",
                placeholder: "",
                help: "Get one at: https://snowboy.kitt.ai"
            },{
                key: "bing_speech_api_key",
                label: "Bing Speech API Key",
                type: "text",
                placeholder: "",
                help: "How to get one: http://domotiquefacile.fr/jarvis/content/bing"
            },{
                key: "wit_server_access_token",
                label: "Wit Server Access Token",
                type: "text",
                placeholder: "",
                help: "Get one at: https://wit.ai/apps/new"
            },{
                key: "dictionary",
                label: "PocketSphinx dictionary file",
                type: "text",
                placeholder: "ex: path/to/dictionary.dic",
                help: "Default: stt_engines/pocketsphinx/jarvis-dictionary.dic"
            },{
                key: "language_model",
                label: "PocketSphinx language model file",
                type: "text",
                placeholder: "ex: path/to/language_model.lm",
                help: "Default: stt_engines/pocketsphinx/jarvis-languagemodel.lm"
            },{
                key: "pocketsphinxlog",
                label: "File to store PocketSphinx logs",
                type: "text",
                placeholder: "ex: path/to/log_file.log",
                help: "Default: /dev/null"
            }]
        },{
            key: "tts",
            label: "Speech synthesis",
            fields: [{
                key: "tts_engine",
                label: "Speech engine",
                type: "select",
                help: "Which engine to use for the speech synthesis. Visit http://domotiquefacile.fr/jarvis/content/tts",
                options: [
                    { value:'svox_pico', label:'SVOX Pico (offline) - Recommended' },
                    { value:'espeak', label:'Espeak (offline)' },
                    { value:'google', label:'Google (online)' },
                    { value:'osx_say', label:'Say (offline) - OSX only' }
                ]
            }]
        }],
        client: $.extend ({}, { // default config
            mute: true,
            port: 8080,
            key: "",
            theme: "slate",
            verbose: false
        }, my.getObjects ('client')), // client config from localstorage
        server: {} // server config
    },
    computed: {
        server_url: function () { return 'http://'+window.location.hostname+':'+this.get('client.port'); }
    },
    
    onrender: function () {
        ractive=this;
        
        // apply default theme
        themesheet.attr('href',themes[ractive.get('client.theme')]).appendTo('head');
        
        // load config
        my.post({
            url: ractive.get ('server_url'),
            data: JSON.stringify ({
                key: ractive.get ("client.key"),
                action: "get_config"
            }),
            success: function (config) {
                ractive.set ('server', config);
                
                // welcome message
                ractive.addMessage ('answer', ractive.get ('server.phrase_welcome'));
            },
            error: function (error) {
                my.error (error);
                $('#client_settings_modal').modal('show');
            }
        });
        
        // Load speech reco engine
        if (!('webkitSpeechRecognition' in window)) {
            ractive.set ('stt_state', 'error');
            my.warn ('Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.');
        } else {
            ractive.set ('stt_state', 'ready');
            ractive.set ('stt_supported', true);
            
            recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'fr-FR'; // TODO hardcoded
            
            recognition.onstart = function() {
                recognizing = true;
                ractive.set ('stt_state', 'recording');
            };
            
            recognition.onerror = function(event) {
                if (event.error == 'no-speech') {
                    ractive.set ('stt_state', 'ready');
                    my.warn ('No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> microphone settings</a>.');
                    ignore_onend = true;
                }
                if (event.error == 'audio-capture') {
                    ractive.set ('stt_state', 'ready');
                    my.error ('No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> microphone settings</a> are configured correctly.');
                    ignore_onend = true;
                }
                if (event.error == 'not-allowed') {
                    if (Date.now() - start_recording < 100) {
                        my.error ('Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream');
                    } else {
                        my.error ('Permission to use microphone was denied.');
                    }
                    ignore_onend = true;
                }
            };
            
            recognition.onend = function() {
                recognizing = false;
                if (ignore_onend) {
                    return;
                }
                ractive.set ('stt_state', 'ready');
                ractive.set ('placeholder', 'Type something...');
                if (ractive.get ('order') === "") {
                    my.info ('Click on the microphone icon and begin speaking.');
                    return;
                } else {
                    ractive.fire ('submit');
                }
            };
            
            recognition.onresult = function(event) {
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (! event.results[i].isFinal) {
                        ractive.set ('order', event.results[i][0].transcript);
                    }
                }
            };
        }
        
        // Set focus on text input
        $('#order_input').focus ();
        
        // initialize code editor
        cmd ('lib/codemirror/lib/codemirror.js',
        'lib/codemirror/mode/shell/shell.js',
        function () {
            var params={
                mode: "shell",
                lineNumbers: true,
                matchBrackets: true
            };
            commmands_cm = CodeMirror.fromTextArea($('#commands_textarea')[0], params);
            events_cm = CodeMirror.fromTextArea($('#events_textarea')[0], params);
        }
    );
},

addMessage: function (key, text) {
    switch (key) {
        case 'debug':
        case 'warning':
        case 'error':
            type=key;
            break;
        case 'you':
            type='you';
            key=ractive.get('server.username');
            break;
        case 'answer':
            type="jarvis";
            key=ractive.get('server.trigger');
            break;
        default:
            my.error ('unknown key: '+key);
    }
    this.push ('messages', {
        type: type,
        key: key,
        text: text
    });
}
});

ractive.observe('client.theme', function ( newValue, oldValue, keypath ) {
    themesheet.attr('href',themes[newValue]);
});

ractive.on ('record', function () {
    if (ractive.get ('stt_state') == "recording") {
        recognition.stop ();
        ractive.set ('placeholder', 'Type something...');
        return;
    }
    recognition.start();
    ignore_onend = false;
    ractive.set ('stt_state', 'recording');
    ractive.set ('placeholder', 'Say something...');
    //my.warn ('Click the "Allow" button above to enable your microphone.');
    start_recording = Date.now();
});

ractive.on ('open_commands', function (e) {
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            key: ractive.get ("client.key"),
            action: "get_commands"
        }),
        success: function (result) {
            $('#commands_modal').modal('show');
            commmands_cm.setValue (result.commands);
            setTimeout(function() {
                commmands_cm.refresh();
                commmands_cm.focus();
            }, 500);
        }
    });
});

ractive.on ('commands_save_btn', function (e) {
    $('#commands_modal').modal('hide');
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            key: ractive.get ("client.key"),
            action: "set_commands",
            commands: commmands_cm.getValue()
        }),
        success: function (message) {
            my.success ("Commands saved successfuly");
        }
    });
});

ractive.on ('open_events', function (e) {
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            key: ractive.get ("client.key"),
            action: "get_events"
        }),
        success: function (result) {
            $('#events_modal').modal('show');
            events_cm.setValue (result.events);
            setTimeout(function() {
                events_cm.refresh();
                events_cm.focus();
            }, 500);
        }
    });
});

ractive.on ('events_save_btn', function (e) {
    $('#events_modal').modal('hide');
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            key: ractive.get ("client.key"),
            action: "set_events",
            events: events_cm.getValue()
        }),
        success: function (message) {
            my.success ("Events saved successfuly");
        }
    });
});

ractive.on ('client_save_btn', function (e) {
    $('#client_settings_modal').modal('hide');
    my.setObjects ('client', ractive.get ('client'));
    my.success ("Settings saved successfuly");
});

ractive.on ('open_settings', function () {
    // reload config
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            key: ractive.get ("client.key"),
            action: "get_config"
        }),
        success: function (config) {
            ractive.set ('server', config);
            // open jarvis settings modal
            $('#settings_modal').modal('show');
            // select first tab
            $('#settings_modal ul.nav-pills > li > a').first().click();
        }
    });
});

ractive.on ('settings_save_btn', function (e) {
    $('#settings_modal').modal('hide');
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            key: ractive.get ("client.key"),
            action: "set_config",
            config: ractive.get('server')
        }),
        success: function (message) {
            my.success ("Settings saved successfuly");
        }
    });
});

ractive.on('submit', function(event) {
    my.debug (event);
    try {
        event.original.preventDefault();
    } catch (e) {}
    var order=ractive.get('order'),
    action=ractive.get ('action'),
    data={
        key: ractive.get ("client.key"),
        verbose: ractive.get('client.verbose')
    };
    ractive.set('order', '');
    data[action]=order;
    if (action == "order") {
        data.mute=ractive.get('client.mute');
        ractive.addMessage ('you', order);
        $(".panel-body").animate({ scrollTop: 9999 });
    } else {
        data.mute=false;
    }
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify (data),
        success: function (messages) {
            $.each (messages, function () {
                $.each (this, function (key, text) {
                    ractive.addMessage (key, text);
                });
            });
            $(".panel-body").animate({ scrollTop: 9999 });
        }
    });
});
