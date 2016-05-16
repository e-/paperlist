(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)

var step = 0;
var papers = [];
var paper = {};
var session = undefined;

$('#prox table tr').each(function(){

  var $this = $(this);
  var a = $(this).find('a');
  var href = a.attr('href');

console.log(step);
  if(step == 1){
    paper.authors = $.trim($this.text()).replace(/\s{2,}/g, ' ');
    step = 2;
    return;
  } else if (step == 2){
    //pages
    step = 3;
    return;
  } else if (step == 3){
    //doi
    step = 4;
    return;
  } else if (step == 4){
    //full text
    step = 5;
    return;
  } else if (step == 5){
    //abstract

    if($.trim($this.text()).indexOf('Other') == 0) {
      return;
    }
    paper.abstract = $.trim($this.find('td:eq(1) span:eq(1)').text()).replace(/\s{2,}/g, ' ');
    if(session)
      paper.session  = session;
    papers.push(paper);
    step = 0;
    return;
  }


  if(href && href.indexOf('citation.cfm') >= 0) {
    step = 1;
    paper = {title: a.text()};
  }
  else if($this.text().toLowerCase().indexOf('session') >= 0)
  {
    session = $.trim($this.text());
  }
});

console.save(papers, 'papers.json');
