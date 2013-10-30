'use strict';

/* Controllers */

angular.module('LoLSummoners.controllers', []).
  controller('HomeCtrl', [function() {

  }]).
  controller('SearchSummonerCtrl', ['$scope', '$http', function SearchSummonerCtrl($scope, $http) {
	$scope.summonerName = '';
	$scope.serverName = 'EUW';

	$scope.search = function(summonerName, serverName) {
		var url = 'http://137.194.11.186:8124/?summonerName=' + summonerName + '&serverName=' + serverName;
		$http.get(url).success(function(data, status, headers, config) {
	    	alert(data);
	  	}).
	  	error(function(data, status, headers, config) {
	    	alert(data);
	  	});
	}
  }])
  .controller('ProfileCtrl', [function() {

  }]);