'use strict';

/* Controllers */

var searchBar = angular.module('jassa.demo.map.ol.basic', ['snap']);


searchBar.controller('AppCtrl', ['$scope', function($scope) {
		$scope.bar = {"value" : "FilterX text hereZ"};
}]);
