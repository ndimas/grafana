define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('ElasticQueryCtrl', function($scope, $timeout, uiSegmentSrv) {

    $scope.init = function() {
      var target = $scope.target;
      if (!target) { return; }

      target.metrics = target.metrics || [{ type: 'count', id: '1' }];
      target.bucketAggs = target.bucketAggs || [{type: 'date_histogram', id: '2', settings: {interval: 'auto'}}];
      target.timeField =  $scope.datasource.timeField;
    };

    $scope.getFields = function(type) {
      var jsonStr = angular.toJson({find: 'fields', type: type});
      return $scope.datasource.metricFindQuery(jsonStr)
      .then(uiSegmentSrv.transformToSegments(false))
      .then(null, $scope.handleQueryError);
    };

    $scope.queryUpdated = function() {
      var newJson = angular.toJson($scope.datasource.queryBuilder.build($scope.target), true);
      if (newJson !== $scope.oldQueryRaw) {
        $scope.rawQueryOld = newJson;
        $scope.get_data();
      }

      $scope.appEvent('elastic-query-updated');
    };

    $scope.handleQueryError = function(err) {
      $scope.parserError = err.message || 'Failed to issue metric query';
      return [];
    };

    $scope.toggleQueryMode = function () {
      if ($scope.target.rawQuery) {
        delete $scope.target.rawQuery;
      } else {
        $scope.target.rawQuery = angular.toJson($scope.datasource.queryBuilder.build($scope.target), true);
      }
    };

    $scope.init();

  });

});
