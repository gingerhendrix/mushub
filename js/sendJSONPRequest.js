/*
 * Author - Yuichi Tateno aka secondlife <hotchpotch@gmail.com> http://rails2u.com/
 *
 * This program is dual-licensed free software
 * you can redistribute it and/or modify it under the terms of the MIT License or the Academic Free License v2.1.
 */

try {
    if (typeof(MochiKit.Async) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.Async JSONP depends on MochiKit.Async!";
}
(function(){
  var counter = 0;
  if (typeof(MochiKit.Async.JSONPCallbacks) == 'undefined') {
    MochiKit.Async.JSONPCallbacks = {
        // WinIE suck , IE error and die...
        // nextCallbackId: MochiKit.Base.counter()
        nextCallbackId: function() { return (counter++) + "" + Number(new Date()) }
    };
  }
})();

MochiKit.Base.update(MochiKit.Async, {
    jsonpQueue : (function(){
        var queue = [];
        var paused = true;

        function processNext(){
          var p = queue.shift();
          MochiKit.Async._sendJSONPRequest(p.deferred, p.url, p.callback_query, p.timeout, p.options);
        }
        
        return {
          add : function(params){
            var d = new MochiKit.Async.Deferred();
            params.deferred = d;
            queue.push(params);
            if(paused){
              this.next();
            }
            return d;
          },
          next : function(){
            if(queue.length > 0){
              paused = false;
              processNext();
            }else{
              paused = true;
            }
          }        
        }
    })(),
    sendJSONPRequest: function (url, callback_query, timeout/* = 30 */, _options/* optional */) {
        return MochiKit.Async.jsonpQueue.add({url : url, callback_query : callback_query, timeout : timeout, options : _options});
    },
    _sendJSONPRequest: function (d, url, callback_query, timeout/* = 30 */, _options/* optional */) {
        var m = MochiKit.Base;
        var self = MochiKit.Async;
        var callbackId = '_' + self.JSONPCallbacks.nextCallbackId();
        var queue = self.jsonpQueue

        if (typeof(timeout) == "undefined" || timeout === null) {
            timeout = 60;
        }
        var options = {
            'type': 'text/javascript',
            'className': 'JSONPRequest'
        };
        m.update(options, _options || {});

        if(url.indexOf('?') >= 0) {
            var ary = url.split('?', 2);
            url = ary[0];
            var queryParams = m.parseQueryString(ary[1] || '');
        } else {
            var queryParams = {};
        }
        queryParams[callback_query] = 'MochiKit.Async.JSONPCallbacks.' + callbackId;
        url += '?' + m.queryString(queryParams);

//        var d = new self.Deferred();
        self.JSONPCallbacks[callbackId] = partial(self._jsonp_callback_handler, d, callbackId);

        var script = document.createElement('script');
        m.update(script, options);
        m.update(script, {
            'src': url,
            'id': '_JSONPRequest' + callbackId
        });

        // FIXME don't work opera.
        // setTimeout with appendChild(script) don't ASYNC timer...
        var timeout = setTimeout(
            function() {
                d.canceller();
                d.errback('JSONP Request timeout');
            }, Math.floor(timeout * 1000)
        );
        d.canceller = m.partial(self._jsonp_canceller, callbackId, timeout);
        
        setTimeout(function() {
            console.log("Appending script " + callbackId);
            document.getElementsByTagName('head')[0].appendChild(script);
        }, 1); // for opera

        return d;
    },
    
    _jsonp_callback_handler: function(d, callbackId, json) {
        console.log("_json_callback_handler[%n] - %o : %o",callbackId, d, json);
        d.callback(json);
        d.canceller(); // remove script element and clear timeout
    },

    _jsonp_canceller: function(callbackId, timeout) {
        try {
            clearTimeout(timeout);
        } catch (e) {
            // pass
        }
        try {
            /* remove script element */
            var element = document.getElementById('_JSONPRequest' + callbackId);
            element.parentNode.removeChild(element);
        } catch (e) {
            // pass
        }
        MochiKit.Async.JSONPCallbacks[callbackId] = function() {};
        MochiKit.Async.jsonpQueue.next();
    }
});

if (MochiKit.__export__) {
    this['sendJSONPRequest'] = MochiKit.Async.sendJSONPRequest;
}


