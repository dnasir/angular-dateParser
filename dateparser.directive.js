angular.module('dateParserDirective', ['dateParser'])
    .directive('dateParser', ['dateFilter', '$dateParser', function(dateFilter, $dateParser) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var dateFormat;
                // If a new format is provided, update the view by rendering the model again.
                attrs.$observe('dateParser', function(value) {
                    dateFormat = value;
                    // Leave the actual rendering to other directives. Angular provides these by default for <input>, <textarea> and <select>
					if (angular.isFunction(ngModel.$render))
                        ngModel.$render();
                });

                // Parse the input value to a date
                ngModel.$parsers.push(function(viewValue) {
                    var date = $dateParser(viewValue, dateFormat);

                    if (isNaN(date)) {
                        ngModel.$setValidity('date', false);
                    } else {
                        ngModel.$setValidity('date', true);
                    }

                    return date;
                });

                // Format the new model value before it is displayed in the editor
                ngModel.$formatters.push(function(modelValue) {
                    return modelValue ? dateFilter(modelValue, dateFormat) : '';
                });
            }
        };
    }]);