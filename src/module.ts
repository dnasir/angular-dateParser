///<reference path="all.d.ts"/>

module NgDateParser {
    'use strict';

    angular.module('dateParser', [])
        .service('dateParserHelpers', DateParserHelpers)
        .factory('$dateParser', ['$locale', 'dateParserHelpers', ($locale, dateParserHelpers) => {
            var instance = new DateParser($locale, dateParserHelpers);
            
            return function(val, format) {
                return instance.parse(val, format);
            };
        }]);
}
