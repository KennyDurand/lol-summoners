'use strict';


// Declare app level module which depends on filters, and services
angular.module('LoLSummoners', [
  'ngRoute',
  'LoLSummoners.filters',
  'LoLSummoners.services',
  'LoLSummoners.directives',
  'LoLSummoners.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/profile/:serverName/:summonerName', {templateUrl: 'partials/profile.html', controller: 'ProfileCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
run(function ($rootScope) {
    $rootScope.simulatorServerUrl = 'http://localhost:8124/';
});

$(function() {
	// Additional JS functions here
	window.fbAsyncInit = function() {
		FB.init({
			appId	: 643848432313317, // App ID
			status	: true,    // check login status
			cookie	: true,    // enable cookies to allow the
	                            // server to access the session
			xfbml	: true     // parse page for xfbml or html5
	                            // social plugins like login button below
	    });
	};

	// Load the SDK Asynchronously
	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
});
