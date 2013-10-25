;(function(doc,win,S){
    function mix() {
        var args = [].slice.call(arguments), isOverlay = true, i = 0, prop, target = {};
        if (typeof args[0] == 'boolean') {
            isOverlay = args.shift();
            target = args[0] || {};
            i = 1;
        }
        for (i, length = args.length; i < length; i += 1) {
            for (prop in args[i]) {
                if (args[i].hasOwnProperty(prop)) {
                    if (isOverlay) {
                        target[prop] = args[i][prop];
                    } else {
                        if (target.hasOwnProperty(prop)) continue;
                        target[prop] = args[i][prop];
                    }

                }
            }
        }
        return target;
    }

    function clazz () {
        var args = [].slice.call(arguments),
            parent,
            props,
            classProps,
            length = args.length;
        if (typeof args[0] === 'function' && args[0].constructor === Function) {
            parent = args[0] || Object;
            props = args[1] || {};
            classProps = args[2] || {};
        } else {
            parent = Object;
            props = args[0] || {};
            classProps = args[1] || {};
        }
        var Child = function () {
            if (Child.parent && Child.parent.hasOwnProperty('_initialize')) {
                Child.parent.init.apply(this, arguments);
            }
            if (Child.prototype.hasOwnProperty('_initialize')) {
                Child.prototype.init.apply(this, arguments);
            }
        };
        var fn = function (parent) {
            this.parent = parent.prototype;
        };
        parent = parent || Object;
        fn.prototype = parent.prototype;
        Child.prototype = new fn(parent);
        Child.prototype.constructor = Child;
        for (var i in props) {
            if (props.hasOwnProperty(i)) {
                Child.prototype[i] = props[i];
            }
        }
        for (var j in classProps) {
            if (classProps.hasOwnProperty(j)) {
                Child[j] = classProps[j];
            }
        }
        return Child;
    }

     function namespace () {
        var PERIOD = '.', a = arguments, o = this, i = 0, length = a.length, j, d, arg;
        for (; i < length; i++) {
            arg = a[i];
            if (arg.indexOf(PERIOD)) {
                d = arg.split(PERIOD);
                for (j = (d[0] == 'Vk') ? 1 : 0; j < d.length; j++) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            } else {
                o[arg] = o[arg] || {};
            }
        }
        return o;
    }

    S.namespace = namespace;
    S.ns = Vk.namespace;
    S.mix=mix;
    S.clazz=clazz;


})(document,window,swallow);