# LoL Summoners

This AngularJS project aims to create an application to consult and share a summonner profile or match details from the online
game League of Legends.

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