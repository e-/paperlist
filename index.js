_.mixin({
  sum: function(arr){
    return _.reduce(arr, function(s, a){return s + a;}, 0);
  }
});

angular
  .module('paperListApp', [])
  .filter('selected', function(){
    return function (items) {
      return items.filter(function (item) {
        return item.selected;
      });
    };
  })
  .filter('selectedPaperCount', function(){
    return function (items) {
      return _.chain(items)
        .map(function(group) {
          return _.chain(group[1])
            .filter(function(c){return c.selected;})
            .map(function(c){return c.papers.length;})
            .sum()
            .value();
        })
        .sum()
        .value();
    };
  })
  .filter('selectedConferenceCount', function(){
    return function (items) {
      return _.chain(items)
        .map(function(group) {
          return _.chain(group[1])
            .filter(function(c){return c.selected;})
            .value()
            .length;
        })
        .sum()
        .value();
    };
  })
  .controller('PaperListCtrl', function($scope, $http){
    function fullYear(abbr){
      var year = +abbr;
      if(year > 50) return 1900 + year;
      else return 2000 + year;
    }

    var defaults = {
      name: ['CHI', 'InfoVis', 'VAST'],
      year: new Date().getYear() + 1900 - 20
    };

    $scope.conferences = [];

    $http
      .get('data.json')
      .then(function(res){
        var count = res.data.length;

        res.data.forEach(function(conf){
          $http
            .get(conf.path)
            .then(function(res){
              var name = conf.name.split(' ')[0],
                  year = conf.name.split(' ')[1];

              var conference = {
                name: name,
                year: year,
                papers: res.data,
                selected: (defaults.name.indexOf(name) >= 0 && fullYear(year) >= defaults.year)
              };

              $scope.conferences.push(conference);
              count--; // requires thread-safe
              if(count == 0)
                $scope.loaded();
            });
        });
      });

    $scope.loaded = function(){
      var groups = _.chain($scope.conferences)
          .sortBy(function(conference){
            return fullYear(conference.year);
          })
          .groupBy('name')
          .value();

      $scope.groups = _.chain(groups)
        .map(function(group){
          if(group.length > 10) {
            return _.groupBy(group, function(conference) {
              var year = +conference.year;
              return conference.name + ' ' + Math.floor(year / 10) + '0';
            })
          }
          var temp = {};
          temp[group[0].name] = group;
          return temp;
        })
        .reduce(function(ret, group){
          _.each(group, function(v, k){
            ret[k] = v;
          });
          return ret;
        }, {})
        .map(function(k, v){
          return [v, k];
        })
        .value();
    };

    $scope.selectAll = function(conferences){
      var value = true;
      if(conferences.length == conferences.filter(function(c){return c.selected;}).length)
        value = false;

      conferences.forEach(function(conference){
        conference.selected = value;
      });
    };
  });
