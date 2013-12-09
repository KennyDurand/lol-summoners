'use strict';

/* Controllers */

angular.module('LoLSummoners.controllers', []).
	controller('HomeCtrl', [function() {

	}]).
	controller('SearchSummonerCtrl', ['$scope', '$location', '$rootScope', '$routeParams', function SearchSummonerCtrl($scope, $location, $rootScope, $routeParams) {
		$scope.summonerName = '';
		$scope.serverName = 'EUW';
		$scope.data = null;

		$scope.search = function(summonerName, serverName) {
			$location.path('/profile/' + serverName + '/' + summonerName);		
		}
	}])
	.controller('ProfileCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$location', function ProfileCtrl($scope, $rootScope, $routeParams, $http, $location) {
		$scope.playerData = null;

		$scope.getSum = function(dataType) {
			var count = 0;
			$scope.playerData.ranked_stats.lifetimeStatistics.forEach(function(stat) {
				if (stat.statType == dataType) {
					count += stat.value;
				}
			});

			return count;
		}

		var url = $rootScope.simulatorServerUrl + '?summonerName=' + $routeParams.summonerName + '&serverName=' + $routeParams.serverName;

		$http({method: 'GET', url: url}).
			success(function(data) {
				$scope.playerData = data.data;

				$scope.generalStats = {};
				$scope.playerData.ranked_stats.lifetimeStatistics.map(function(element) {
					if (!(element.statType in $scope.generalStats)) {
						$scope.generalStats[element.statType] = $scope.getSum(element.statType);
					}
				});
				$scope.recentGames = $scope.playerData.recent_games.gameStatistics;
				$scope.countGames = $scope.getSum('TOTAL_SESSIONS_PLAYED');
			}).
			error(function() {
				$location.path('/home');
				alert('Request to the API failed.');
			});

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
						"url": window.location.origin + window.location.pathname + '#' + $location.path(),
						"image":'http://ispeedify.com/wp-content/uploads/2013/07/league-of-legends-logo-lol.png',
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

					$.post($rootScope.simulatorServerUrl + 'publish_summoner?'+requestData).
						success(function() {
							alert('Publication effectuée.');
						})
						.fail(function() {
							alert('Publication échouée !');
						});
				}
			}, {scope: 'publish_actions'});
		}

		$scope.publishMatch = function(match) {
			FB.login(function(response) {
				if (response.authResponse && response.status == 'connected') {
					var shareObject = {
						"title": match.championId + ' (' + $scope.getRatio(match) + ')',
						"url": window.location.origin + window.location.pathname + '#' + $location.path(),
						"image":'http://ispeedify.com/wp-content/uploads/2013/07/league-of-legends-logo-lol.png',
						"data": {
							"summoner_name": $scope.playerData.summoner.name,
							"ratio":$scope.getRatio(match),
							"champion_name":match.championId,
							"map_name":match.gameMapId
						}
					};

					var requestData = decodeURIComponent($.param({
						userToken: response.authResponse.accessToken,
						userId: response.authResponse.userID,
						objectToShare: encodeURIComponent(JSON.stringify(shareObject)),
					}));

					$.post($rootScope.simulatorServerUrl + 'publish_game?'+requestData).
						success(function() {
							alert('Publication effectuée.');
						})
						.fail(function() {
							alert('Publication échouée !');
						});
				}
			}, {scope: 'publish_actions'});
		}

		$scope.searchIntoStatistics = function(match, statName) {
			var i = 0;
			while (i < match.statistics.length && match.statistics[i].statType != statName) {
				i++;
			}
			if (i >= match.statistics.length) {
				return false;
			} else {
				return match.statistics[i].value;
			}
		}

		$scope.setMatchClass = function(match) {
			return 'match-details alert alert-' + ($scope.searchIntoStatistics(match, 'WIN') == 1 ? 'success' : 'danger');
		}

		$scope.getRatio = function(match) {
			var results = [];
			var statNames = ['CHAMPIONS_KILLED', 'NUM_DEATHS', 'ASSISTS'];

			statNames.forEach(function(statName) {
				results.push($scope.searchIntoStatistics(match, statName));
			});

			return results.join('/');
		}

		$scope.getItems = function(match) {
			var results = [];
			var statNames = ['ITEM1', 'ITEM2', 'ITEM3', 'ITEM4', 'ITEM5', 'ITEM6'];

			statNames.forEach(function(statName) {
				var value = null;
				if (value = $scope.searchIntoStatistics(match, statName)) {
					results.push(value);
				}
			});

			return results.join(', ');
		}
	}]);