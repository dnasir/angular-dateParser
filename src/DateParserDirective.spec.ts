import * as angular from 'angular';
import 'angular-mocks';

describe('dateParser directive', function() {
    var $scope, $compile;

    beforeEach(angular.mock.module('dateParser'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
    }));

    describe('UI', function() {
        var inputEl, changeInputValueTo;

        function assignElements(wrapElement) {
            inputEl = wrapElement.find('input');
        }

        beforeEach(inject(function($sniffer) {
            $scope.datetime = new Date(2013, 11, 22, 13, 45, 0);
            $scope.dateFormat = 'dd.MM.yyyy';

            var wrapElement = $compile(angular.element('<div ng-form name="testForm"><input type="text" ng-model="datetime" date-parser="{{dateFormat}}" /></div>'))($scope);
            $scope.$digest();

            assignElements(wrapElement);

            changeInputValueTo = function (el, value) {
                el.val(value);
                el.triggerHandler($sniffer.hasEvent('input') ? 'input' : 'change');
                $scope.$digest();
            };
        }));

        it('should have an initial value that uses the given format', function() {
            expect(inputEl.val()).toEqual('22.12.2013');
            expect($scope.testForm.$valid).toEqual(true);
        });

        it('should change model value when input value is changed', function() {
            changeInputValueTo(inputEl, '23.12.2013');

            expect($scope.datetime).toEqual(new Date(2013, 11, 23, 0, 0, 0));
            expect($scope.testForm.$valid).toEqual(true);
        });

        it('should change the view value when model value is changed', function() {
            $scope.datetime = new Date(2014, 11, 23, 21, 50, 0);
            $scope.$digest();

            expect(inputEl.val()).toEqual('23.12.2014');
            expect($scope.testForm.$valid).toEqual(true);
        });

        it('should reset the view value when model value is changed to null', function() {
            $scope.datetime = new Date(2014, 11, 23, 21, 50, 0);
            $scope.$digest();

            expect(inputEl.val()).toEqual('23.12.2014');
            expect($scope.testForm.$valid).toEqual(true);

            $scope.datetime = null;
            $scope.$digest();

            expect(inputEl.val()).toEqual('');
            expect($scope.testForm.$valid).toEqual(true);
        });

        it('should reset the view value when model value is changed to empty', function() {
            $scope.datetime = new Date(2014, 11, 23, 21, 50, 0);
            $scope.$digest();

            expect(inputEl.val()).toEqual('23.12.2014');
            expect($scope.testForm.$valid).toEqual(true);

            $scope.datetime = '';
            $scope.$digest();

            expect(inputEl.val()).toEqual('');
            expect($scope.testForm.$valid).toEqual(true);
        });

        it('should set validity as invalid when an invalid value is entered', function() {
            changeInputValueTo(inputEl, 'something completely invalid');

            expect($scope.testForm.$valid).toEqual(false);
        });

        it('should set validity when ng-required is present', function() {
            var wrapElement = $compile(angular.element('<div ng-form name="testForm"><input type="text" ng-model="datetime" date-parser="{{dateFormat}}" ng-required="true" /></div>'))($scope);
            $scope.$digest();

            assignElements(wrapElement);

            changeInputValueTo(inputEl, '');

            expect($scope.testForm.$valid).toBeFalsy();
            expect($scope.testForm.$error.date).toBeFalsy();

            changeInputValueTo(inputEl, 'something invalid');

            expect($scope.testForm.$valid).toBeFalsy();
            expect($scope.testForm.$error.date).toBeTruthy();

            changeInputValueTo(inputEl, '23.12.2013');

            expect($scope.testForm.$valid).toBeTruthy();
            expect($scope.testForm.$error.date).toBeFalsy();

            $scope.datetime = null;
            $scope.$digest();

            expect($scope.testForm.$valid).toBeFalsy();
            expect($scope.testForm.$error.date).toBeFalsy();
        });
    });
});
