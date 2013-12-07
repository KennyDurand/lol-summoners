var http = require('http');
var url = require('url');
var querystring = require('querystring');
var request = require('request');
var app_token = '643848432313317|SqqLeDPy-doGrYzgdVOxBOUW0Dg';

var server = http.createServer(function(req, res) {
	var parameters = url.parse(req.url, true).query;
	if (req.url.match(/^\/publish_?/)) {
		if (req.url.match(/^\/publish_game?/)) {
			objectName = 'game';
		} else if (req.url.match(/^\/publish_summoner?/)) {
			objectName = 'summoner'
		}

		if (parameters.userToken && parameters.objectToShare && parameters.userId) {
			appRequestData = querystring.stringify({
				object: parameters.objectToShare,
				access_token: app_token
			});

			request.post(
				{
					uri:'https://graph.facebook.com/app/objects/lol-summoners:' + objectName,
					headers:{'content-type': 'application/x-www-form-urlencoded'},
					body: appRequestData
				},
				function(err,result,body){
					console.log(objectName + ' done: '+ body)
					if (objectName == 'game') {
						meRequestData = querystring.stringify({
							game: JSON.parse(body).id,
							access_token: parameters.userToken,
						});
					} else {
						meRequestData = querystring.stringify({
							summoner: JSON.parse(body).id,
							access_token: parameters.userToken,
						});
					}

					request.post(
						{
							uri:'https://graph.facebook.com/' + parameters.userId + '/lol-summoners:share',
							headers:{'content-type': 'application/x-www-form-urlencoded'},
							body: meRequestData
						},
						function(err,result,body){
							console.log('Share done: '+ body)
							res.writeHead(200, {
								'Content-Type': 'application/json',
								'Access-Control-Allow-Origin': '*'
							});
							res.end(body);
						}
					);
				}
			);
		}
	} else {
		if (parameters.summonerName && parameters.serverName) {
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			});

		res.end(JSON.stringify(buildJson(parameters)));
		console.log('Request received with summonerName = "' + parameters.summonerName + '" and serverName = "' + parameters.serverName + '"');
		}
	}
});
server.listen(8124);
console.log('Server running at http://localhost:8124/');

function randomInteger(limit) {
	return Math.floor(Math.random()*(limit+1));
}

function summonerApi(summoner) {
	return {
		"internalName": summoner.toLowerCase(),
  		"name": summoner,
		"acctId": 1+randomInteger(99999),
  		"profileIconId": 1+randomInteger(999),
  		"revisionDate":"\/Date(1357002079809)\/",
  		"summonerLevel":1+randomInteger(29),
  		"summonerId":1+randomInteger(9999)
	};
}

function rankedStatsApi(summoner) {
	var statsArray = [];
	for (i=100; i < 110; i++) {
		var games = 1+randomInteger(49);
		var lost = randomInteger(games);
		var championStats = [
				{
		           "statType":"TOTAL_PENTA_KILLS",
		           "value":randomInteger(1),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_DEATHS_PER_SESSION",
		           "value":randomInteger(150),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_GOLD_EARNED",
		           "value":randomInteger(100000000),
		           "championId":i
		        },
		        {
		           "statType":"MOST_SPELLS_CAST",
		           "value":randomInteger(3),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_TURRETS_KILLED",
		           "value":randomInteger(25),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_MAGIC_DAMAGE_DEALT",
		           "value":randomInteger(1000000),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_PHYSICAL_DAMAGE_DEALT",
		           "value":randomInteger(25),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_ASSISTS",
		           "value":randomInteger(500),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_TIME_SPENT_DEAD",
		           "value":randomInteger(10000),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_FIRST_BLOOD",
		           "value":randomInteger(50),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_UNREAL_KILLS",
		           "value":0,
		           "championId":i
		        },
		        {
		           "statType":"MAX_NUM_DEATHS",
		           "value":randomInteger(20),
		           "championId":i
		        },
		        {
		           "statType":"MAX_CHAMPIONS_KILLED",
		           "value":randomInteger(20),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_QUADRA_KILLS",
		           "value":randomInteger(5),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_TRIPLE_KILLS",
		           "value":randomInteger(30),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_DOUBLE_KILLS",
		           "value":randomInteger(200),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_MINION_KILLS",
		           "value":randomInteger(10000),
		           "championId":i
		        },
		        {
		           "statType":"MOST_CHAMPION_KILLS_PER_SESSION",
		           "value":randomInteger(20),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_DAMAGE_TAKEN",
		           "value":randomInteger(2000000),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_DAMAGE_DEALT",
		           "value":randomInteger(2000000),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_CHAMPION_KILLS",
		           "value":randomInteger(500),
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_SESSIONS_WON",
		           "value":games-lost,
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_SESSIONS_LOST",
		           "value":lost,
		           "championId":i
		        },
		        {
		           "statType":"TOTAL_SESSIONS_PLAYED",
		           "value":games,
		           "championId":i
		        }
		];

		championStats.forEach(function(stat) {
			statsArray.push(stat);
		});
	}

	return {
			"lifetimeStatistics": statsArray,
      		"modifyDate":"\/Date(1352765802000)\/"
	};
}

function recentGamesApi(summoner) {
	var matchesArray = [];
	var fellowPlayers = [];

	for (i=0; i<4; i++) {
		fellowPlayers.push({
            "championId":1+randomInteger(140),
			"summonerId":1+randomInteger(9999),
			"summonerName":Math.random().toString(36).slice(2),
			"teamId":100
		});
	}
	for (i=0; i<5; i++) {
		fellowPlayers.push({
            "championId":1+randomInteger(140),
			"summonerId":1+randomInteger(9999),
			"summonerName":Math.random().toString(36).slice(2),
			"teamId":200
		});
	}

	for (i=0; i<10; i++) {
		matchesArray.push({
            "ranked": randomInteger(1) == 0 ? true : false,
            "skinIndex": randomInteger(5),
            "fellowPlayers":fellowPlayers,
            "gameType":"MATCHED_GAME",
            "experienceEarned":randomInteger(100),
            "eligibleFirstWinOfDay":randomInteger(1) == 0 ? true : false,
            "gameMapId":1+randomInteger(3),
            "leaver":randomInteger(99) > 80 ? true : false,
            "spell1":1+randomInteger(15),
            "spell2":1+randomInteger(15),
            "teamId":100,
            "summonerId":0,
            "statistics":[
               {
                  "statType":"CHAMPIONS_KILLED",
                  "value":randomInteger(20)
               },
               {
                  "statType":"ITEM5",
                  "value":1+randomInteger(4999)
               },
               {
                  "statType":"PHYSICAL_DAMAGE_DEALT_PLAYER",
                  "value":randomInteger(150000)
               },
               {
                  "statType":"ASSISTS",
                  "value":randomInteger(30)
               },
               {
                  "statType":"NEUTRAL_MINIONS_KILLED",
                  "value":randomInteger(300)
               },
               {
                  "statType":"SIGHT_WARDS_BOUGHT_IN_GAME",
                  "value":randomInteger(25)
               },
               {
                  "statType":"PHYSICAL_DAMAGE_DEALT_TO_CHAMPIONS",
                  "value":randomInteger(75000)
               },
               {
                  "statType":"LARGEST_MULTI_KILL",
                  "value":randomInteger(5)
               },
               {
                  "statType":"LARGEST_KILLING_SPREE",
                  "value":randomInteger(10)
               },
               {
                  "statType":"GOLD_EARNED",
                  "value":randomInteger(20000)
               },
               {
                  "statType":"ITEM0",
                  "value":1+randomInteger(5000)
               },
               {
                  "statType":"NUM_DEATHS",
                  "value":randomInteger(20)
               },
               {
                  "statType":"TOTAL_DAMAGE_DEALT_TO_CHAMPIONS",
                  "value":randomInteger(75000)
               },
               {
                  "statType":"ITEM4",
                  "value":1+randomInteger(5000)
               },
               {
                  "statType":"TOTAL_HEAL",
                  "value":randomInteger(5000)
               },
               {
                  "statType":"TOTAL_DAMAGE_DEALT",
                  "value":randomInteger(150000)
               },
               {
                  "statType":"WIN",
                  "value":randomInteger(1)
               },
               {
                  "statType":"TOTAL_DAMAGE_TAKEN",
                  "value":randomInteger(75000)
               },
               {
                  "statType":"MINIONS_KILLED",
                  "value":randomInteger(300)
               },
               {
                  "statType":"TOTAL_TIME_SPENT_DEAD",
                  "value":randomInteger(300)
               },
               {
                  "statType":"MAGIC_DAMAGE_DEALT_TO_CHAMPIONS",
                  "value":randomInteger(75000)
               },
               {
                  "statType":"MAGIC_DAMAGE_TAKEN",
                  "value":randomInteger(75000)
               },
               {
                  "statType":"LARGEST_CRITICAL_STRIKE",
                  "value":randomInteger(1500)
               },
               {
                  "statType":"MAGIC_DAMAGE_DEALT_PLAYER",
                  "value":randomInteger(150000)
               },
               {
                  "statType":"ITEM2",
                  "value":1+randomInteger(5000)
               },
               {
                  "statType":"ITEM1",
                  "value":1+randomInteger(5000)
               },
               {
                  "statType":"LEVEL",
                  "value":1+randomInteger(17)
               },
               {
                  "statType":"PHYSICAL_DAMAGE_TAKEN",
                  "value":randomInteger(75000)
               },
               {
                  "statType":"ITEM3",
                  "value":1+randomInteger(5000)
               }
            ],
            "afk":randomInteger(100) > 80 ? true : false,
            "boostXpEarned":randomInteger(200),
            "level":1+randomInteger(29),
            "userId":randomInteger(99999),
            "createDate":"\/Date(1356692182105)\/",
            "userServerPing":randomInteger(200),
            "premadeSize":1+randomInteger(4),
            "boostIpEarned":randomInteger(200),
            "gameId":randomInteger(100000000),
            "timeInQueue":randomInteger(500),
            "ipEarned":randomInteger(400),
            "gameMode":randomInteger(1) == 0 ? "CLASSIC" : "DRAFT",
            "subType":"RANKED_SOLO_5x5",
            "queueType":"RANKED_SOLO_5x5",
            "premadeTeam":randomInteger(1) == 0 ? true : false,
            "championId":1+randomInteger(140)
		});
	}

	return {
		"gameStatistics":matchesArray,
      	"userId":randomInteger(99999)
   	}
}

function leaguesApi(summoner) {
	var leaguesArray = [];
	var leaguesKind = ["RANKED_SOLO_5x5", "RANKED_TEAMS_5x5", "RANKED_TEAMS_3x3"];
	var tiersKind = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "CHALLENGER"];
	var ranksKind = ["I", "II", "III", "IV", "V"];

	leaguesKind.forEach(function(leagueName) {
		if (randomInteger(1) == 0) {
			var tier = tiersKind[randomInteger(tiersKind.length - 1)];
			var rank = ranksKind[randomInteger(ranksKind.length - 1)];

			leaguesArray.push({
	            "queue":leagueName,
	            "name":Math.random().toString(36).slice(2),
	            "tier": tier,
	            "requestorsRank": rank,
	            "entries":[
	               {
	                  "previousDayLeaguePosition":randomInteger(45),
	                  "hotStreak":randomInteger(1) == 0 ? true : false,
	                  "freshBlood":randomInteger(1) == 0 ? true : false,
	                  "tier":tier,
	                  "lastPlayed":0,
	                  "playerOrTeamId":1+randomInteger(99999),
	                  "leaguePoints":randomInteger(100),
	                  "inactive":randomInteger(1) == 0 ? true : false,
	                  "rank":rank,
	                  "veteran":randomInteger(1) == 0 ? true : false,
	                  "queueType":leagueName,
	                  "losses":randomInteger(100),
	                  "playerOrTeamName":summoner,
	                  "wins":randomInteger(100),
	               }
	            ],
	            "requestorsName":summoner
        	});
		}
	});

	return {
		"summonerLeagues": leaguesArray
	};
}

function buildJson(parameters) {
	var summoner = parameters.summonerName;
	var server = parameters.serverName;

	return {
		"data": {
			"server": server,
			"summoner": summonerApi(summoner),
			"ranked_stats": rankedStatsApi(summoner),
			"recent_games": recentGamesApi(summoner),
			"leagues": leaguesApi(summoner),
		},
		"success": true,
	}
}