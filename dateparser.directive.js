angular.module('dateParserDirective', ['dateParser'])
    .directive('dateParser', ['dateFilter', '$dateParser', function(dateFilter, $dateParser) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var dateFormat;
                
                attrs.$observe('dateParser', function(value) {
                    dateFormat = value;
                    ngModel.$render();
                });

                var parseDate = function(viewValue) {
                    var date = $dateParser(viewValue, dateFormat);

                    if(isNaN(date)) {
                        ngModel.$setValidity('date', false);
                    } else {
                        ngModel.$setValidity('date', true);
                    }

                    return date;
                };
                ngModel.$parsers.unshift(parseDate);

                ngModel.$render = function() {
                    var date =  ngModel.$modelValue ? dateFilter(ngModel.$modelValue, dateFormat) : '';
                    element.val(date);
                    scope.ngModel = ngModel.$modelValue;
                };

                element.bind('input change keyup', function() {
                    scope.$apply(function() {
                        scope.ngModel = ngModel.$modelValue;
                    });
                });
            }
        };
    }]);