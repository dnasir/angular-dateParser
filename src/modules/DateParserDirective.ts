///<reference path="../all.d.ts"/>

module NgDateParser {
    class DateParserDirective implements ng.IDirective {
        'use strict';

        restrict = 'A';
        require = 'ngModel';
        scope = {
            ngModel: '='
        };
        
        constructor(private dateFilter, private $dateParser: IDateParser, private $locale: ng.ILocaleService) { }

        link: ng.IDirectiveLinkFn = ($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: any) => {
            let dateFormat: string;

            attrs.$observe('dateParser', (value: string) => {
                dateFormat = value;
                ngModel.$render();
            });
            
            $scope.$watchCollection(() => this.$locale, (value, oldValue) => {
                if(!angular.equals(value, oldValue)) {
                    ngModel.$render();
                }
            });

            ngModel.$parsers.unshift((viewValue) => {
                let date = this.$dateParser(viewValue, dateFormat);

                // Set validity when view value changes
                ngModel.$setValidity('date', !viewValue || angular.isDate(date));

                return date;
            });

            ngModel.$render = () => {
                let modelValueExists = ngModel.$modelValue === '' || ngModel.$modelValue === null || ngModel.$modelValue;
                element.val(modelValueExists ? this.dateFilter(ngModel.$modelValue, dateFormat) : undefined);
                this.scope.ngModel = ngModel.$modelValue;
            };

            // Format the new model value before it is displayed
            ngModel.$formatters.push((modelValue) => {
                // Set validity when model value changes
                ngModel.$setValidity('date', !modelValue || angular.isDate(modelValue));

                return angular.isDate(modelValue) ? this.dateFilter(modelValue, dateFormat) : '';
            });
        }
        
        static factory(): ng.IDirectiveFactory {
            let directive: ng.IDirectiveFactory = (dateFilter, $dateParser, $locale) => new DateParserDirective(dateFilter, $dateParser, $locale);
            directive.$inject = ['dateFilter', '$dateParser', '$locale'];
            return directive;
        }
    }
    
    angular.module('dateParser')
        .directive('dateParser', DateParserDirective.factory());
}