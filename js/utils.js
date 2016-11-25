var my = new function () { // new is needed!
	var _ERROR_   = 0,
		_WARNING_ = 1,
		_NOTICE_  = 2,
		_LOG_     = 3,
		_DEBUG_   = 4;
	
	this.loglevel = 4;
	
	this.notify = function (type, message, url) {
		$.notify ({
			message: message
		},{
			type: type,
			offset: {x: 20, y: 20},
			delay: 2000,
			mouse_over: 'pause',
			z_index: 1051 // bs dropdown at 1000 but bs modal at 1040
		});
	};

	this.error = function (message, url) {
		if (this.loglevel >= _ERROR_) {
			console.error (message);
			this.notify ('danger', message);
		}
	};

	this.warn = function (message, url) {
		if (this.loglevel >= _WARNING_) {
			console.warn (message);
			this.notify ('warning', message);
		}
	};

	this.info = function (message, url) {
		if (this.loglevel >= _NOTICE_) {
			console.info (message);
			this.notify ('info', message);
		}
	};

	this.success = function (message, url) {
		if (this.loglevel >= _NOTICE_) {
			console.info (message);
			this.notify ('success', message);
		}
	};

	this.log = function () {
		if (this.loglevel >= _LOG_) {
			console.log.apply (console, Array.prototype.slice.call(arguments));
		}
	};

	this.debug = function () {
		if (this.loglevel >= _DEBUG_) {
			console.debug.apply (console, Array.prototype.slice.call(arguments));
		}
	};

	this.post = function (args) {
		var url = args.url,
			data = args.data,
			success = args.success,
			ferror = args.error,
			timeout = typeof (args.timeout) === 'undefined'?5000:args.timeout;
		my.log ('	calling "'+url+'" with parameters '+JSON.stringify (data)+'...');
		$.post({
			url: url,
			data: data,
			timeout: timeout,
			success: function(response) {
                my.log ('	response from '+url+':', response);
                if (typeof response !== 'object') {
					var tmp = document.createElement("DIV");  // strip html tags
					tmp.innerHTML = response; 				  // strip html tags
					var message = tmp.textContent||tmp.innerText; // strip html tags
                    console.error ('Error '+error+' from '+url+': ',message);
					if (typeof(ferror) == 'function')
						ferror(message);
					else
						my.error (/*'Error '+error+' from '+url+': '+*/message);
					return false;
				}
				if (typeof(success) == 'function')
					success(response);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				// $.mobile.loading('hide');
				var message = textStatus+';'+XMLHttpRequest.responseText+';'+errorThrown;
				if (typeof(ferror) == 'function')
					ferror(message);
				else {
                    my.warn ('Warning '+XMLHttpRequest.status+' from '+url+': '+ message);
                }
			}
		});
	};
    
    this.get = function (fieldname) {
        value = localStorage.getItem(fieldname);
        return value;
    };

    this.set = function (fieldname, value) {    
        try {
            localStorage.setItem(fieldname, typeof value==="undefined"?"":value);
        } 
        catch (e) {
            if (e == QUOTA_EXCEEDED_ERR)
                alert("Error: Local Storage limit exceeds.");
            else
                alert("Error: Saving to local storage.");
        }
    };

    this.unset = function (fieldname) {
        localStorage.removeItem(fieldname);
    };

    this.getObjects = function (collection) {
    	var json=get(collection);
    	return json && JSON.parse(json) || [];
    };

    this.setObjects = function (collection, objects) {
    	my.debug ('setting objects for', collection);
    	set(collection, JSON.stringify(typeof objects === "undefined"?[]:objects));
    };

    this.getObject = function (collection, id) {
    	my.debug ('retrieving object "'+id+'" from "'+collection+'" in localStorage...');
    	var objects = getObjects (collection);
    	return objects[id];
    };

    this.addObject = function (collection, object) {
    	my.debug ('adding item to "'+collection+'" in localStorage...');
    	var objects = getObjects (collection);
    	if (objects)
    		objects.push(object);
    	else
    		objects = [object];
    	setObjects (collection, objects);
    	my.debug ('	item added successfuly');
    	//set ('localversion', moment().format('YYYY-MM-DD HH:mm:ss'));
    	//sync ();
    };

    this.editObject = function (collection, index, object) {
    	my.debug ('updating item id', index, 'with', object, 'from', collection, 'in localStorage...');
    	objects = getObjects (collection);
    	objects[index] = object;
    	setObjects (collection, objects);
    	my.debug ('	item updated succesfuly');
    	//set ('localversion', moment().format('YYYY-MM-DD HH:mm:ss'));
    	//sync ();
    };

    this.moveObject = function (collection, old_index, new_index) {
    	var objects = getObjects (collection);
    	objects.move (old_index, new_index);
    	setObjects (collection, objects);
    	//set ('localversion', moment().format('YYYY-MM-DD HH:mm:ss'));
    	//sync ();
    };

    this.removeObject = function (collection, index) {
    	my.debug ('removing item "'+index+'" from '+collection+' localStorage...');
    	var objects = getObjects (collection);
    	objects.splice (index, 1);
    	setObjects (collection, objects);
    	my.debug ('	item removed successfuly');
    	//set ('localversion', moment().format('YYYY-MM-DD HH:mm:ss'));
    	//sync ();
    };
    
    this.getUrlVars = function (url) {
        var vars = {};
        var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    };
} ();

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
