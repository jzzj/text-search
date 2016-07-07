(function (f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.TextSearch = f();
    }
})(function () {
    var PinYin = null;
    function includeChinese(){
        if(typeof define==='function'){
            if(define.amd){
                require(['./pinyin'], function(m){
                    PinYin = m;
                });
            }else{
                PinYin = require('./pinyin');
            }
        }else if(window.TextSearch){
            PinYin = window.PinYin;
        }else{
            console.error('need to include pinyin.js to able chinese support.');
        }
    }
    includeChinese();

    function Search(opts, pick, fuzzy){
        if(opts instanceof Array){
            this.list = opts;
            this.pick = pick;
            this.fuzzy = fuzzy;
        }else if(typeof opts === "object"){
            this.list = opts.list;
            this.pick = opts.pick;
            this.fuzzy = opts.fuzzy;
        }
        //save history search result
        this.results = {};
    }

    Search.prototype = {
        constructor: Search,
        search: function(key){
            var list = this.list;
            if(!list){
                return null;
            }
            var result = this.results[key];
            if(result != null){
                return result;
            }
            var keys = Object.keys(SearchFuzzyHooks),
                pick = this.pick,
                fuzzy = this.fuzzy!=null ? Number(this.fuzzy) : keys[keys.length - 1],
                reg = SearchFuzzyHooks[fuzzy](key),
                result = list.filter(function(item){
                    var text = pick==null ? item : item[pick],
                        ret = reg.test(text);
                    if(fuzzy==0){
                        return ret;
                    }
                    return ret || reg.test(PinYin.ConvertPinyin(text).join(''));
                });
            this.results[key] = result;
            return result;
        },
        setList: function(list){
            if(list !== this.list){
                this.list = list;
                this.results = {};
            }
        },
        setPick: function(pick){
            this.pick = pick;
            this.results = {};
        },
        setFuzzy: function(fuzzy){
            this.fuzzy = fuzzy;
            this.results = {};
        }
    };

    var SearchFuzzyHooks = (function(){
        function getReg(key, func){
            var ret = key.match(/[^\s,-;.\/，；]+/g);
            if(ret.length === 1){
                return new RegExp(ret[0]);
            }
            return new RegExp(ret
                        .map(func)
                        .join('.*?'));
        }
        return {
            0: function(key){
                return getReg(key, function(item){
                        return "\\b"+item+"\\b"
                    });
            },
            1: function(key){
                var rchinese = /[\u2E80-\u9FFF]+/;
                return getReg(key, function(item){
                    if(rchinese.test(item)){
                        item = PinYin.ConvertPinyin(item);
                    }
                    return "\\b"+item+"\\b"
                });
            },
            2: function(key){
                return new RegExp(key.split('').join('.*?'));
            },
            3: function(key){
                key = PinYin.ConvertPinyin(key);
                return new RegExp(key.join('.*?'));
            }
        }
    }());

    return Search;
});

