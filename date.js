;(function(doc,win,S){

    function prettyDate(time) {
        var date = new Date(time || ""),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
            return null;

        return day_diff == 0 && (
            diff < 60 && "刚才" ||
                diff < 120 && "1分钟以前" ||
                diff < 3600 && Math.floor(diff / 60) + "分钟以前" ||
                diff < 7200 && "一小时以前" ||
                diff < 86400 && Math.floor(diff / 3600) + "小时以前") ||
            day_diff == 1 && "昨天" ||
            day_diff < 7 && day_diff + "天以前" ||
            day_diff < 31 && Math.ceil(day_diff / 7) + "星期以前";
    }
    function diffDate(d1, d2, type) {
        var yearMilliseconds = 1000 * 60 * 60 * 24 * 365.26;
        var unitMillisecond = {
            'mi': 1,
            's': 1e3,
            'm': 6e4,
            'h': 36e5,
            'D': 864e5,
            'M': yearMilliseconds / 12,
            'Y': yearMilliseconds
        };
        var unit = unitMillisecond[type] ? unitMillisecond[type] : yearMilliseconds;
        return Math.floor((d2 - d1) / unit);
    }
    /*
     * eg:formatString="YYYY-MM-DD hh:mm:ss";
     */

    function formatDate(date, formatString) {

        var o = {
            "M+": date.getMonth() + 1,
            "D+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };

        if (/(Y+)/.test(formatString)) {
            formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(formatString)) {
                formatString = formatString.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return formatString;
    }

    function parseDate(dateString, dateFormat) {
        var reg=/(\d+)/g,methodNames=['setFullYear','setMonth','setDate'];
        var d=dateString.match(reg),id=new Date(0);
        for (var i = 0; i < d.length; i++) {
            var obj = d[i];
            if(i==1){
                obj-=1
            }
            if(methodNames[i]){
                id[methodNames[i]](obj)
            }
        }
        return id;
    }

    var date = S.fn.date = {};
    date.prettyDate = prettyDate;
    date.formatDate = formatDate;
    date.parseDate = prettyDate;
    date.diffDate = diffDate;

})(document,window,swallow);