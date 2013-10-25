;(function(doc,win,S){

    function params(data) {
        var qs = [];
        for (var name in data) {
            if(data.hasOwnProperty(name)){
                qs.push(name+'=' + data[name]);
            }
        }
        return qs.join('&')
    }
    function ajax (uri, option) {
        var httpRequest,
            httpSuccess,
            timeout,
            isTimeout = false,
            isComplete = false;

        var defaultOption = {
            method: 'GET',
            data: null,
            arguments: null,

            onSuccess: function () {
            },
            onError: function () {
            },
            onComplete: function () {
            },
            onTimeout: function () {
            },

            isAsync: true,
            timeout: 30000,
            contentType: '',
            type: "xml"
        };
        option = S.mix(defaultOption, option);

        if (S.isObject(option.data)) {
            option.data = params(option.data);
        }

        uri = uri || "";
        timeout = option.timeout;

        httpRequest = new window.XMLHttpRequest();

        httpSuccess = function (r) {
            try {
                return (!r.status && location.protocol == "file:")
                    || (r.status >= 200 && r.status < 300)
                    || (r.status == 304)
                    || (navigator.userAgent.indexOf("Safari") > -1 && typeof r.status == "undefined");
            } catch (e) {
            }
            return false;
        };

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4) {
                if (!isTimeout) {
                    var o = {};
                    o.responseText = httpRequest.responseText;
                    o.responseXML = httpRequest.responseXML;
                    o.data = option.data;
                    o.status = httpRequest.status;
                    o.uri = uri;
                    o.arguments = option.arguments;
                    if (option.type === 'json') {
                        try {
                            o.responseJSON = JSON.parse(httpRequest.responseText);
                        } catch (e) {
                        }
                    }
                    if (httpSuccess(httpRequest)) {
                        option.onSuccess(o);
                    } else {
                        option.onError(o);
                    }
                    option.onComplete(o);
                }
                isComplete = true;
                httpRequest = null;
            }
        };

        if (option.method === "GET") {
            if (option.data) {
                uri += (uri.indexOf("?") > -1 ? "&" : "?") + option.data;
                option.data = null;
            }
            httpRequest.open("GET", uri, option.isAsync);
            httpRequest.setRequestHeader("Content-Type", option.contentType || "text/plain;charset=UTF-8");
            httpRequest.send();
        } else if (option.method === "POST") {
            httpRequest.open("POST", uri, option.isAsync);
            httpRequest.setRequestHeader("Content-Type", option.contentType || "application/x-www-form-urlencoded;charset=UTF-8");
            httpRequest.send(option.data);
        } else {
            httpRequest.open(option.method, uri, option.isAsync);
            httpRequest.send();
        }

        window.setTimeout(function () {
            var o;
            if (!isComplete) {
                isTimeout = true;
                o = {};
                o.uri = uri;
                o.arguments = option.arguments;
                option.onTimeout(o);
                option.onComplete(o);
            }
        }, timeout);

        return httpRequest;
    }

    S.params=params;
    S.ajax=ajax;

})(document,window,swallow);