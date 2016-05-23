var utils = {
    //getCss:获取元素的样式
    getCss: function (curEle, attr) {
        var reg = /^[+-]?(\d|([1-9]\d+))(\.\d+)?(px|pt|em|rem)$/, val = null;
        if ("getComputedStyle" in window) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === "opacity") {
                var temp = curEle.currentStyle["filter"], tempReg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = tempReg.test(temp) ? tempReg.exec(temp)[1] : "1";
                val = parseFloat(val) / 100;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        return reg.test(val) ? parseFloat(val) : val;
    },
    //setCss:设置元素的样式
    setCss: function (curEle, attr, value) {
        var reg = /^(width|height|top|left|right|bottom|((margin|padding)(Left|Top|Right|Bottom)?))$/;
        if (attr === "opacity") {
            if (value >= 0 && value <= 1) {
                curEle["style"]["opacity"] = value;
                curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            }
        } else if (attr === "float") {
            curEle["style"]["cssFloat"] = value;
            curEle["style"]["styleFloat"] = value;
        } else if (reg.test(attr)) {
            curEle["style"][attr] = isNaN(value) ? value : value + "px";
        } else {
            curEle["style"][attr] = value;
        }
    },
    //setGroupCss:批量设置元素的样式
    setGroupCss: function (curEle, options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                this.setCss(curEle, key, options[key]);
            }
        }
    }
};