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

                ngModel.$parsers.unshift(function(viewValue) {
                    var date = $dateParser(viewValue, dateFormat);

                    if(isNaN(date)) {
                        ngModel.$setValidity('date', false);
                    } else {
                        ngModel.$setValidity('date', true);
                    }

                    return date;
                });

                // Make sure we render using our format on init
                ngModel.$render = function() {
                    element.val(ngModel.$modelValue ? dateFilter(ngModel.$modelValue, dateFormat) : undefined);
                    scope.ngModel = ngModel.$modelValue;
                };

                // Format the new model value before it is displayed in the editor
				ngModel.$formatters.push(function(modelValue) {
					return modelValue ? dateFilter(modelValue, dateFormat) : '';
				});
            }
        };
    }]);