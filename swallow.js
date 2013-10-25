;
(function (win, undefined) {
    var slice = Array.prototype.slice,
        _each = function (array, callback) {
            for (var i = 0, length = array.length; i < length; i++)
                callback.call(array[i], i, array[i]);
        };
    var swallow = function (selector, context) {
        if (!(this instanceof swallow)) {
            return new swallow(selector, context);
        }
        var self = this, nodes;
        if (selector === undefined) {
            self.length = 0;
            self.nodes = [];
            return this;
        }

        if (swallow.isElement(selector)) {
            nodes = [selector];
        } else {
            if (swallow.isString(context)) {
                context = document.querySelector(context);
            }

            nodes = slice.call((context || document).querySelectorAll(selector));
        }

        for (var i = 0, l = nodes.length; i < l; i++) {
            self[i] = nodes[i];
        }
        self.length = nodes.length;
        self.nodes = nodes;

    };
    swallow.empty = function () {
        return swallow()
    };

    swallow.fn = swallow.prototype;

    var copyTo = function (a, b) {
        var alength = a.length,
            blength = b.length;
        for (var i = 0; i < alength; i++) {
            a[blength + i] = b[i];
        }

        a.length = alength + blength;
        return a;
    };

    swallow.fn.find = function (selector) {
        var i,
            initSwallow = swallow.empty(),
            initLength = this.length;
        if (initLength === 0) {
            return initSwallow;
        }
        for (i = 0; i < initLength; i++) {
            copyTo(initSwallow, swallow(selector, this[ i ]));
        }
        return initSwallow;
    };

    swallow.fn.each = function (callback) {
        _each(this, callback);
        return this;
    };

    swallow.fn.parent = function () {
        if (this.length === 0) {
            return swallow.empty();
        }
        var parent = this[0].parentNode;
        return parent && parent.nodeType !== 11 ? dolla(parent) : dolla.empty();
    };

    swallow.fn.html = function (strOrFn) {
        if (strOrFn === undefined) {
            return this.length > 0 ? this[0].innerHTML : null;
        }
        if (swallow.isString(strOrFn)) {
            this.each(function () {
                this.innerHTML = strOrFn;
            });
        }
        var returnStr;
        if (swallow.isFunction(strOrFn)) {
            this.each(function (i, el) {
                if (returnStr = strOrFn.call(this, i, this.innerHTML)) {
                    this.innerHTML = returnStr;
                }
            });
        }
        return this;
    };


    swallow.fn.css = function (name, value) {
        if (this.length === 0) {
            return null;
        }

        var elem = this[0];
        if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
        }

        if (value !== undefined) {
            elem.style[name] = value;
            return;
        }
        return elem.style[name];

    };


    function createDelegate(target, handler) {
        var interceptor = function (event) {
            var matching = swallow(target, this);
            if (matching.length > 0) {
                var parents = [];
                var current = event.target;
                while (current) {
                    parents.push(current);
                    current = current.parentNode;
                }

                _each(matching, function () {
                    if (parents.indexOf(this) !== -1) {
                        return handler.call(this, event);
                    }
                });
            }
        };
        return interceptor;
    }

    //event

    swallow.fn.on = function (event, targetOrHandler, handlerOrUndefined) {
        var isDelegated = !isFunction(targetOrHandler) && isFunction(handlerOrUndefined),
            delegate = isDelegated ? createDelegate(targetOrHandler, handlerOrUndefined) : null;
        return this.each(function () {
            isDelegated
                ? this.addEventListener(event, delegate)
                : this.addEventListener(event, targetOrHandler);
        });
    };

    swallow.fn.off = function (event, handler) {
        return this.each(function () {
            this.removeEventListener(event, handler);
        });
    };
    swallow.fn.one = function (eventName, fn) {
        return this.each(function () {
            this.addEventListener(eventName, function (e) {
                fn.call(this, e);
                this.removeEventListener(eventName, arguments.callee);
            })
        })

    };
    swallow.fn.triger = function (eventName, data) {
        return this.each(function () {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true);
            event.type = eventName;
            event.data = data || {};
            this.dispatchEvent(event);
        });
    };

    var fns = [];

    function domReady(fn) {
        fns.forEach(function (fn) {
            fn();
        });
        document.removeEventListener('DOMContentLoaded', domReady);
    }

    swallow.ready = function (fn) {
        if (fns.indexOf(fn) != -1) {
            fns.push(fn);
        }
    };
    document.addEventListener('DOMContentLoaded', domReady);

    //className

    ['toggleClass', 'addClass', 'removeClass'].forEach(function (methodName) {
        swallow.fn[methodName] = function () {
            var args = [].slice.call(arguments),
                method = methodName.replace('Class', '');
            return this.each(function () {
                DOMTokenList.prototype[method].apply(this.classList, args);
            })
        };
    });

    //element data
    swallow.fn.data = function (name, value) {
        var _hasName = swallow.isString(name);
        if (_hasName && value) {
            return this.each(function () {
                this.dataset[name] = value;
            })
        }
        if (_hasName) {
            return this[0].dataset[name];
        }
        return null;

    };
    swallow.fn.removeData = function (name) {
        return this.each(function () {
            var _data = this.dataset;
            if (_data.hasOwnProperty(name)) {
                delete _data[name];
            }
        })
    };
    swallow.fn.clear = function () {
        return this.each(function () {
            var _data = this.dataset;
            for (var i in _data) {
                delete _data[i];
            }
        })
    };

    //object type
    swallow.type = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1)
    };
    var TYPE_STRINGS = ['String', 'Number', 'Object', 'Array', 'Null', 'Date', 'Undefined', 'Boolean', 'Function'];
    for (var i = 0, length = TYPE_STRINGS.length; i < length; i++) {
        var m = TYPE_STRINGS[i];
        swallow['is' + m] = function (typeString) {
            return function (obj) {
                return swallow.type(obj) === typeString;
            }
        }(TYPE_STRINGS[i])
    }
    swallow.isElement = function (o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement :
                o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
            );
    };

    swallow.conflict = function () {
        delete win.swallow ;
        delete win.S;
        return swallow;
    } ;
    win.swallow = swallow;
    win.S = win.S || swallow;
})(window);