'use strict';

/* Controllers */

angular.module('LoLSummoners.controllers', []).
  controller('HomeCtrl', [function() {

  }]).
  controller('SearchSummonerCtrl', ['$scope', '$http', '$location', '$rootScope', function SearchSummonerCtrl($scope, $http, $location, $rootScope) {
	$scope.summonerName = '';
	$scope.serverName = 'EUW';
	$scope.data = null;

	$scope.search = function(summonerName, serverName) {
		var url = 'http://137.194.11.186:8124/?summonerName=' + summonerName + '&serverName=' + serverName;

		$http({method: 'GET', url: url}).success(function(data) {
			$rootScope.playerData = data.data;
			$location.path('/profile');
	  	}).
	  	error(function(data, status, headers, config) {
	    	$scope.searchForm.$setValidity('Request to the stats API failed.', false);
	  	});
		
	}
  }])
  .controller('ProfileCtrl', ['$scope', '$rootScope', function ProfileCtrl($scope, $rootScope) {
	$scope.playerData = $rootScope.playerData;

	$scope.getSum = function(dataType) {
		var count = 0;
		$scope.playerData.ranked_stats.lifetimeStatistics.forEach(function(stat) {
			if (stat.statType == dataType) {
				count += stat.value;
			}
		});

		return count;
	}

	$scope.countGames = $scope.getSum('TOTAL_SESSIONS_PLAYED');

	$scope.getAverage = function(dataType) {
		return (parseFloat($scope.getSum(dataType)) / $scope.countGames).toFixed(1);
	}

	$scope.publishSummoner = function() {
		FB.login(function(response) {
			if (response.authResponse && response.status == 'connected') {
				var leagueName = 'Unranked';
				$scope.playerData.leagues.summonerLeagues.forEach(function(league) {
					if (league.queue == "RANKED_SOLO_5x5") {
						leagueName = league.tier + ' ' + league.requestorsRank;
					}
				});
				var shareObject = {
					"title": $scope.playerData.summoner.name + '\'s profile',
					"url": window.location.origin + window.location.pathname,
					"image":'http://upload.wikimedia.org/wikipedia/fr/7/77/League_of_Legends_logo.png',
					"data": {
						"summoner_name":$scope.playerData.summoner.name,
						"level":$scope.playerData.summoner.summonerLevel,
						"server":$scope.playerData.server,
						"league":leagueName
					}
				};

				var requestData = decodeURIComponent($.param({
					userToken: response.authResponse.accessToken,
					userId: response.authResponse.userID,
					objectToShare: encodeURIComponent(JSON.stringify(shareObject)),
				}));

				$.post('http://137.194.11.186:8124/publish_summoner?'+requestData).
					done(function() {
						alert('cooool');
					})
					.fail(function() {
						alert('NOOOO');
					});
			}
		});
	}
  }]);