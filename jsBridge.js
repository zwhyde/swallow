;
(function ($) {
    var mode = "production";
    var transports = {
        "unknown os":function () {
            return {
                init:function () {
                    throw "unknown os";
                }

            }
        },
        ios:function () {
            return {
                config:{
                    protocol:"BMJavscriptBridge",
                    callJavascriptName:"BMCallJavascript_Ios"
                },
                init:function () {
                    return this;
                },
                sendMessage:function (methodName, params) {
                    var p = this.config.protocol + "://";
                    params = params || {};
                    var message = Base64.encode(JSON.stringify({methodName:methodName, params:params}));
                    return p + message;
                }
            }
        },
        android:function () {
            return {
                config:{
                    interfaceName:"BMInterface",
                    callJavascriptName:"BMCallJavascript_Android"
                },
                init:function () {
                    window[this.config.callJavascriptName] = {};
                    return this;

                },
                sendMessage:function (methodName, params) {
                    var nativeInterface = window[this.config.interfaceName];
                    if (nativeInterface) {
                        nativeInterface[methodName].call(window, params);
                    }
                }
            }
        }
    };

    var Bridge = {
        config:{

        },
        init:function (os) {
//            this._transport = transports[this.stringFromOS(os)]().init();
        },
        stringFromOS:function (os) {
            for (n in transports) {
                if (transports.hasOwnProperty(n) && os[n]) {
                    return n;
                }
            }

            return "unknown os";
        },
        sendMessage:function(methodName, params){
            this._transport.sendMessage(methodName, params);
        }

    };

    var App = {
        init:function(){
            this.bridge=Bridge.init($.os);
        },
        getCatalog:function(){

        },
        getTitle:function(){

        }

    };

    console.log(transports.ios().sendMessage("dfdf",{fijefj:454,Fdf:"时代发生大幅"}))
    window.haha = {

    }
})(Zepto);