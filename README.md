# text-search
search text, support chinese.

## Usage

```js
  var TextSearch = require('./');
  var textSearch = new TextSearch({list: ["asfd",234,"空军飞机上对抗肌肤","sdfdsf"]});
  console.log(textSearch.search('f'));
  textSearch.setFuzzy(0);
  console.log(textSearch.search('飞机')); 
  ```