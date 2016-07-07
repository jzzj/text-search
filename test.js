//tests.
if(typeof require==='function'){
    if(require.amd){
        require(['./'], test);
    }else{
        test(require('./'));
    }
}else if(window.TextSearch){
    test(window.TextSearch);
}else{
    console.error('need to include TextSearch to test it.');
}

function test(TextSearch){
    var list = [{
        text: "asdfsfdsf",
        id:1
    }, {
        text: "展开绝地反击看",
        id:1
    }, {
        text: "发个链接",
        id:1
    }, {
        text: "342天",
        id:1
    }];
    var textSearch = new TextSearch(list, "text");
    var result = textSearch.search("d");
    console.log("result: ",result);
    var result = textSearch.search("天");
    console.log("result: ",result);
}
