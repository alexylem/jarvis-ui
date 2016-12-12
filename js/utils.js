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
    
	this.ajax = function (args) {
		ractive.set ('loading', true);
        var url = args.url,
			data = args.data,
            //timeout = typeof (args.timeout) === 'undefined'?5000:args.timeout,
			success = args.success,
			ferror = args.error;
		my.log ('	calling "'+url+'" with parameters ', data);
		$.ajax({
			url: url,
            type : args.type,
			data: data,
            dataType: "json",
            tryCount : 0, // http://stackoverflow.com/questions/10024469/whats-the-best-way-to-retry-an-ajax-request-on-failure-using-jquery
            retryLimit : 3,
			//timeout: timeout,
			success: function(response) {
                ractive.set ('loading', false);
                if (typeof response !== 'object') {
					try {
                        response = JSON.parse (response);
                    } catch (e) {
                        var tmp = document.createElement("DIV");      // strip html tags
    					tmp.innerHTML = response; 				      // strip html tags
    					var message = tmp.textContent||tmp.innerText; // strip html tags
                        console.error ('Error from '+url+': ',message);
        				if (typeof(ferror) == 'function')
        					ferror(message);
        				else
        					my.error (/*'Error '+error+' from '+url+': '+*/message);
        				return false;
                    }
                }
                my.log ('	response from '+url+':', response);
				if (typeof(success) == 'function')
					success(response);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
                my.log ('Error', XMLHttpRequest, textStatus, errorThrown);
                if (textStatus == 'timeout') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        my.ajax (this); //try again
                        my.info ('Retrying to reach '+url+'...');
                    }
                }
                ractive.set ('loading', false);
                if (XMLHttpRequest.readyState === 0)
                    error = "Connection error. Verify Jarvis is started, has jarvis-api installed and check api port in Client settings";
                else
                    error = 'Error '+XMLHttpRequest.status+' from '+url+': '+textStatus+';'+XMLHttpRequest.responseText+';'+errorThrown;
                if (typeof(ferror) == 'function')
    				ferror(error);
				else
                    my.error (error);
            }
		});
	};
    
    this.post = function (args) {
        args.type='POST';
        this.ajax (args);
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
    	var json=my.get(collection);
    	return json && JSON.parse(json) || [];
    };

    this.setObjects = function (collection, objects) {
    	my.debug ('setting objects for', collection);
    	my.set(collection, JSON.stringify(typeof objects === "undefined"?[]:objects));
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
