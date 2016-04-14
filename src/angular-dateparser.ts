///<reference path="all.d.ts"/>

module NgDateParser {
    angular.module('dateParser', [])
        .factory('$dateParser', ['$locale', ($locale) => {
            var instance = new DateParser($locale);
            
            return function(val, format) {
                return instance.parse(val, format);
            };
        }]);
}