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
  $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'ProfileCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

var jQuery = angular.element;
