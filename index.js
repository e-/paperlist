var app = {};

angular
  .module('paperListApp', [])
  .controller('PaperListCtrl', function($scope){
    $scope.app = app;
  });

$(function(){
  var count;
  $.ajax({
    url: 'data.json', 
    dataType: 'json',
    success: function(confList){
      app.confList = confList;
      count = confList.length;
      confList.forEach(function(conf){
        $.ajax({
          url: conf.path,
          dataType: 'json',
          success: function(papers){
            count--;
            conf.papers = papers;

            if(count == 0){
              app.count = confList.map(function(c){return c.papers.length;}).reduce(function(a,b){return a+b;},0);
              app.confCount = confList.length;
              $('#paperList').scope().$apply();
            }
          }
        });
      });
    }
  });

});
