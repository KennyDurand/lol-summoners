# LoL Summoners

This AngularJS project aims to create an application to consult and share a summonner profile or match details from the online
game League of Legends.

How to run it locally
---------------------
In order to run the application, you need a machine with NodeJS.
Move to the root directory of the project, and use these two commands to run the Web server, and the data simulator server:

	$ nodejs scripts/web-server.js
==> Runs the Web server on port 8000


	$ nodejs scripts/simulator-server.js
==> Runs the simulator on port 8124

If you want/need to run the simulator server on a different IP address or a different port, it is possible, but you need to change the
value of the global variable `simulatorServerUrl`, in file `app.js`, line 18.

UML
---
[Summoner]<>1-*[Match]
[Summoner]<>1-0..3[League]
[Summoner]<>1-n[RankedStat]
[Match]<>1-n[MatchDetail]
[Match]<>1-10[Teammate]
[Teammate]++1-1[Champion]
[RankedStat]++1-1[Champion]
[Match]++1-0..6[Item]