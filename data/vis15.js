/* loading

var script = document.createElement('script');
script.src = "url";

document.head.appendChild(script);

 */

var pp = $('#node-3237 > div > p');
var len = pp.length / 2;
var papers = [];

for(var i = 0 ;i < len ;++i) {
  var $meta = $(pp.get(i*2));
  var $papers = $(pp.get(i*2 + 1));
  var session = $meta.find('em span').text().split(':')[1];
  console.log(pp.get(i*2+1));
}
