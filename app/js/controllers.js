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

		$http({method: 'GET', url: url}).success(function(data) {
	    	alert('YOUPI');
	  	}).
	  	error(function(data, status, headers, config) {
	    	$scope.searchForm.$setValidity('Request to the stats API failed.', false);
	  	});
		
	}
  }])
  .controller('ProfileCtrl', [function() {

  }]);