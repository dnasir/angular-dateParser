import * as angular from 'angular';
import { IDateParser } from './DateParser';

export class DateParserDirective implements angular.IDirective {
    restrict = 'A';
    require = 'ngModel';
    scope = {
        ngModel: '='
    };

    constructor(private dateFilter, private $dateParser: IDateParser, private $locale: angular.ILocaleService) { }

    link: angular.IDirectiveLinkFn = ($scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ngModel: any) => {
        let dateFormat: string;

        attrs.$observe('dateParser', (value: string) => {
            dateFormat = value;
            ngModel.$render();
        });

        $scope.$watchCollection(() => this.$locale, (value, oldValue) => {
            if (!angular.equals(value, oldValue)) {
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

    static factory(): angular.IDirectiveFactory {
        let directive: angular.IDirectiveFactory = (dateFilter, $dateParser, $locale) => new DateParserDirective(dateFilter, $dateParser, $locale);
        directive.$inject = ['dateFilter', '$dateParser', '$locale'];
        return directive;
    }
}
