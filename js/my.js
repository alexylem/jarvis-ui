// Log levels
my.loglevel = 4;
Ractive.DEBUG = (my.log_level >= 4);

// Global variables
var themes = {
    slate: "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/slate/bootstrap.min.css",
    default: "css/light.css"
};
var themesheet = $('<link href="" rel="stylesheet" />');
var codemirror;

var ractive = new Ractive({
    // The `el` option can be a node, an ID, or a CSS selector.
    el: '#container',
    
    // We could pass in a string, but for the sake of convenience
    // we're passing the ID of the <script> tag above.
    template: '#template',
    
    // Here, we're passing in some initial data
    data: {
        messages: [],
        client: {
            mute: true,
            port: 8080,
            theme: "slate",
            verbose: false
        }, // client config
        server: {} // server config
    },
    computed: {
        server_url: function () { return 'http://'+window.location.hostname+':'+this.get('client.port'); }
    },
    
    onrender: function () {
        themesheet.attr('href',themes[this.get('client.theme')]).appendTo('head');
        
        $('#order_input').focus ();
        this.addMessage ('Jarvis', 'Bonjour');
        
        cmd ('lib/codemirror/lib/codemirror.js',
    		 'lib/codemirror/mode/shell/shell.js',
             function () {
                 codemirror = CodeMirror.fromTextArea($('#commands_textarea')[0], {
                     mode: "shell",
                     lineNumbers: true,
                     matchBrackets: true
                 });
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
            case 'You':
                type='you';
                break;
            default:
                type="jarvis";
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

$('#commands_modal').on('show.bs.modal', function () {
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            action: "get_commands"
        }),
        success: function (result) {
            codemirror.setValue (result.commands);
            setTimeout(function() {
                codemirror.refresh();
                codemirror.focus();
            }, 500);
        }
    });
});

ractive.on ('commands_save_btn', function (e) {
    $('#commands_modal').modal('hide');
    my.post({
        url: ractive.get ('server_url'),
        data: JSON.stringify ({
            action: "set_commands",
            commands: codemirror.getValue()
        }),
        success: function (message) {
            my.success ("Commands saved successfuly");
        }
    });
});

ractive.on('submit', function(event) {
    event.original.preventDefault();
    var order=this.get('order'),
        action=ractive.get ('action'),
        data={ verbose: ractive.get('client.verbose') };
    ractive.set('order', '');
    data[action]=order;
    if (action == "order") {
        data.mute=ractive.get('client.mute');
        ractive.addMessage ('You', order);
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
