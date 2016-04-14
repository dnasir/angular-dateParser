/*!
 * angular-dateParser 1.1.0-beta
 * https://github.com/dnasir/angular-dateParser
 * Copyright (c) 2016, Dzulqarnain Nasir
 * Licensed under: MIT
 */


angular.module('dateParser')
    .directive('dateParser', ['dateFilter', '$dateParser', function(dateFilter, $dateParser) {

        'use strict';

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var dateFormat;

                attrs.$observe('dateParser', function(value) {
                    dateFormat = value;
                    ngModel.$render();
                });

                ngModel.$parsers.unshift(function(viewValue) {
                    var date = $dateParser(viewValue, dateFormat);

                    ngModel.$setValidity('date', !viewValue || angular.isDate(date));

                    return date;
                });

                ngModel.$render = function() {
                    var modelValueExists = ngModel.$modelValue === '' || ngModel.$modelValue === null || ngModel.$modelValue;
                    element.val(modelValueExists ? dateFilter(ngModel.$modelValue, dateFormat) : undefined);
                    scope.ngModel = ngModel.$modelValue;
                };

                ngModel.$formatters.push(function(modelValue) {
                    ngModel.$setValidity('date', !modelValue || angular.isDate(modelValue));

                    return angular.isDate(modelValue) ? dateFilter(modelValue, dateFormat) : '';
                });
            }
        };
    }]);
