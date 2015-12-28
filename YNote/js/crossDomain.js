(function(){
    var croDomain = {};
    var interval_id,
        last_hash,
        cache_bust = 1,
        rm_callback,
        window = this,
        FALSE = !1,
        postMessage = 'postMessage',
        addEventListener = 'addEventListener',
        p_receiveMessage,
        has_postMessage = window[postMessage];
    croDomain.isFunction = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };
    croDomain.browser = function () {
        var bro = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? bro.msie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? bro.firefox = s[1] :
                        (s = ua.match(/chrome\/([\d.]+)/)) ? bro.chrome = s[1] :
                                (s = ua.match(/opera.([\d.]+)/)) ? bro.opera = s[1] :
                                        (s = ua.match(/version\/([\d.]+).*safari/)) ? bro.safari = s[1] : 0;
        return bro;
    }();
    croDomain.each = function (object, callback, context) {
        if (object === undefined || object === null) {
            return;
        }
        if (object.length === undefined || croDomain.isFunction(object)) {
            for (var name in object) {
                if (object.hasOwnProperty(name)) {  //只有此元素本身属性调用回调
                    if (callback.call(context || object[name], name, object[name]) === false) {
                        break;
                    }
                }
            }
        } else {
            for (var i = 0; i < object.length; i++) {
                if (callback.call(context || object, i, object[i]) === false) {
                    break;
                }
            }
        }
        return object;
    };
    croDomain.param = function(data) {
        if (typeof data === 'string') {
            return data;
        }
        var param = [];
        croDomain.each(data, function(index, value) {
            if (value) {
                value = encodeURIComponent(value);
                if (croDomain.browser.firefox) {
                    value = encodeURIComponent(unescape(value)); // 将数据转换成 ISO-8859-1 格式
                }
                param.push(encodeURIComponent(index) + '=' + value);
            }
        });
        return param.join('&').replace( r20, '+' );
    };
    croDomain.postMessage = function( message, target_url, target ) {
        if ( !target_url ) { return; }
        message = typeof message === 'string' ? message : croDomain.param( message);
        target = target || parent;
        if ( has_postMessage ) {
            target[postMessage]( message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1' ) );
        } else if ( target_url ) {
            target.location = target_url.replace( /#.*$/, '' ) + '#' + (+new Date) + (cache_bust++) + '&' + message;
       }
    };
    croDomain.receiveMessage = p_receiveMessage = function( callback, source_origin, delay ) {
        if ( has_postMessage ) {
            if ( callback ) {
                rm_callback && p_receiveMessage();
                rm_callback = function(e) {
                    if ( ( typeof source_origin === 'string' && e.origin !== source_origin )
                    || ( croDomain.isFunction( source_origin ) && source_origin( e.origin ) === FALSE ) ) {
                        return FALSE;
                    }
                    callback( e );
                };
            }
            if ( window[addEventListener] ) {
                window[ callback ? addEventListener : 'removeEventListener' ]( 'message', rm_callback, FALSE );
            } else {
                window[ callback ? 'attachEvent' : 'detachEvent' ]( 'onmessage', rm_callback );
            }
        } else {
            interval_id && clearInterval( interval_id );
            interval_id = null;
            if ( callback ) {
                delay = typeof source_origin === 'number'
                ? source_origin
                : typeof delay === 'number'
                ? delay
                : 100;
                interval_id = setInterval(function(){
                    var hash = document.location.hash,
                    re = /^#?\d+&/;
                    if ( hash !== last_hash && re.test( hash ) ) {
                        last_hash = hash;
                        callback({ data: hash.replace( re, '' ) });
                    }
                }, delay );
            }
        }
    };
    window.croDomain = croDomain;
})();
