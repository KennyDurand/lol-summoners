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

		var setSpell = function(id) {
			var spellArray = [
				'Heal',
				'Barrier',
				'Cleanse',
				'Ignite',
				'Flash',
				'Clarity',
				'Teleport',
				'Revive',
				'Exhaust',
				'Clairvoyance',
				'Surge',
			];

			return spellArray[id-1];
		}

		var setChampion = function(id) {
			var championArray = [
				'Ezreal',
				'Annie',
				'Katarina',
				'Jarvan IV',
				'Cho\'gath',
				'Kog\'maw',
				'Zed',
				'Kassadin',
				'Caitlyn',
				'Blitzcrank',
				'Thresh',
				'Lee Sin',
				'Skarner',
				'Rumble',
				'Singed',
			];

			return championArray[id-1];
		}

		var setItem = function(id) {
			var itemArray = [
				'Zhonya\'s Hourglass',
				'Lich Bane',
				'Amplifying Tome',
				'Fiendish Codex',
				'Doran\'s Blade',
				'Doran\'s Shield',
				'Doran\'s Ring',
				'Thornmail',
				'Rabadon\'s Deathcap',
				'Randuin\'s Omen',
				'Needlessly Large Rod',
				'Ancient Coin',
				'Relic Shield',
				'Spellthief Edge',
				'Tear of the Goddess',
				'Chalice of Harmony',
				'Hexdrinker',
				'BF Sword',
				'Zeal',
				'Phantom Dancer',
				'Infinity Edge',
				'Bloodthirster',
				'Blade of the Ruined King',
				'Quicksilver Sash',
				'Aegis of the Legion',
				'Locket of Iron Solari',
			];

			return itemArray[id-1];
		}

		$scope.transform = function(data) {
			data.recent_games.gameStatistics.forEach(function(game, index) {
				game.championId = setChampion(game.championId);

				game.spell1 = setSpell(game.spell1);
				game.spell2 = setSpell(game.spell2);

				game.statistics.forEach(function(element) {
					if (element.statType.match(/^ITEM[0-9]$/)) {
						element.value = setItem(element.value);
					}
				})
			});

			return data;
		}

		var url = $rootScope.simulatorServerUrl + '?summonerName=' + $routeParams.summonerName + '&serverName=' + $routeParams.serverName;

		$http({method: 'GET', url: url}).
			success(function(data) {
				$scope.playerData = $scope.transform(data.data);

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
			var statNames = ['ITEM0', 'ITEM1', 'ITEM2', 'ITEM3', 'ITEM4', 'ITEM5'];

			statNames.forEach(function(statName) {
				var value = null;
				if (value = $scope.searchIntoStatistics(match, statName)) {
					results.push(value);
				}
			});

			return results.join(', ');
		}

		$scope.filterStats = function(stats, blacklist) {
			var result = {};
			stats.forEach(function(item) {
				if ($.inArray(item.statType, blacklist) < 0) {
					result[item.statType] = item.value;
				}
			});

			return result;
		}

		$scope.filterMatchStats = function(stats) {
			var blacklist = [
				'CHAMPIONS_KILLED',
				'ITEM0',
				'ITEM1',
				'ITEM2',
				'ITEM3',
				'ITEM4',
				'ITEM5',
				'ASSISTS',
				'NEUTRAL_MINIONS_KILLED',
				'GOLD_EARNED',
				'NUM_DEATHS',
				'WIN',
				'MINIONS_KILLED',
			];

			return $scope.filterStats(stats, blacklist);
		}
	}]);