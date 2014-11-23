describe('dateParser directive', function() {
    var $scope, $compile;

    beforeEach(module('dateParser'));

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

            var wrapElement = $compile(angular.element('<div><input type="text" ng-model="datetime" date-parser="{{dateFormat}}" /></div>'))($scope);
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
        });

        it('should change model value when input value is changed', function() {
            changeInputValueTo(inputEl, '23.12.2013');

            expect($scope.datetime).toEqual(new Date(2013, 11, 23, 0, 0, 0))
        });
    });
});