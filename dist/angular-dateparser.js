/*!
 * angular-dateParser 1.1.0-beta
 * https://github.com/dnasir/angular-dateParser
 * Copyright (c) 2016, Dzulqarnain Nasir
 * Licensed under: MIT
 */

var NgDateParser;
(function (NgDateParser) {
    var DateParser = (function () {
        function DateParser($locale) {
            var _this = this;
            this.$locale = $locale;
            this.parse = function (val, format) {
                if (angular.isDate(val)) {
                    return val;
                }
                if (!angular.isString(val)) {
                    return undefined;
                }
                try {
                    if (!format.length) {
                        return new Date(val);
                    }
                    if (_this.datetimeFormats != null && _this.datetimeFormats[format]) {
                        format = _this.datetimeFormats[format];
                    }
                    var now = new Date(), i_val = 0, i_format = 0, format_token = '', year = now.getFullYear(), month = now.getMonth() + 1, date = now.getDate(), hh = 0, mm = 0, ss = 0, sss = 0, ampm = 'am', z = 0, parsedZ = false;
                    while (i_format < format.length) {
                        format_token = format.charAt(i_format);
                        var token = '';
                        if (format.charAt(i_format) === "'") {
                            var _i_format = i_format;
                            while ((format.charAt(++i_format) !== "'") && (i_format < format.length)) {
                                token += format.charAt(i_format);
                            }
                            if (val.substring(i_val, i_val + token.length) !== token) {
                                throw 'Pattern value mismatch';
                            }
                            i_val += token.length;
                            i_format++;
                            continue;
                        }
                        while ((format.charAt(i_format) === format_token) && (i_format < format.length)) {
                            token += format.charAt(i_format++);
                        }
                        if (token === 'yyyy' || token === 'yy' || token === 'y') {
                            var minLength, maxLength;
                            if (token === 'yyyy') {
                                minLength = 4;
                                maxLength = 4;
                            }
                            if (token === 'yy') {
                                minLength = 2;
                                maxLength = 2;
                            }
                            if (token === 'y') {
                                minLength = 2;
                                maxLength = 4;
                            }
                            year = _this.getInteger(val, i_val, minLength, maxLength);
                            if (year === null) {
                                throw 'Invalid year';
                            }
                            i_val += Math.max(year.toString().length, token.length);
                            if (year.toString().length === 2) {
                                if (year > 70) {
                                    year = 1900 + (year - 0);
                                }
                                else {
                                    year = 2000 + (year - 0);
                                }
                            }
                        }
                        else if (token === 'MMMM' || token === 'MMM') {
                            month = 0;
                            for (var i = 0; i < _this.monthNames.length; i++) {
                                var month_name = _this.monthNames[i];
                                if (val.substring(i_val, i_val + month_name.length).toLowerCase() === month_name.toLowerCase()) {
                                    month = i + 1;
                                    if (month > 12) {
                                        month -= 12;
                                    }
                                    i_val += month_name.length;
                                    break;
                                }
                            }
                            if ((month < 1) || (month > 12)) {
                                throw 'Invalid month';
                            }
                        }
                        else if (token === 'EEEE' || token === 'EEE') {
                            for (var j = 0; j < _this.dayNames.length; j++) {
                                var day_name = _this.dayNames[j];
                                if (val.substring(i_val, i_val + day_name.length).toLowerCase() === day_name.toLowerCase()) {
                                    i_val += day_name.length;
                                    break;
                                }
                            }
                        }
                        else if (token === 'MM' || token === 'M') {
                            month = _this.getInteger(val, i_val, token.length, 2);
                            if (month === null || (month < 1) || (month > 12)) {
                                throw 'Invalid month';
                            }
                            i_val += Math.max(month.toString().length, token.length);
                        }
                        else if (token === 'dd' || token === 'd') {
                            date = _this.getInteger(val, i_val, token.length, 2);
                            if (date === null || (date < 1) || (date > 31)) {
                                throw 'Invalid date';
                            }
                            i_val += Math.max(date.toString().length, token.length);
                        }
                        else if (token === 'HH' || token === 'H') {
                            hh = _this.getInteger(val, i_val, token.length, 2);
                            if (hh === null || (hh < 0) || (hh > 23)) {
                                throw 'Invalid hours';
                            }
                            i_val += Math.max(hh.toString().length, token.length);
                        }
                        else if (token === 'hh' || token === 'h') {
                            hh = _this.getInteger(val, i_val, token.length, 2);
                            if (hh === null || (hh < 1) || (hh > 12)) {
                                throw 'Invalid hours';
                            }
                            i_val += Math.max(hh.toString().length, token.length);
                        }
                        else if (token === 'mm' || token === 'm') {
                            mm = _this.getInteger(val, i_val, token.length, 2);
                            if (mm === null || (mm < 0) || (mm > 59)) {
                                throw 'Invalid minutes';
                            }
                            i_val += Math.max(mm.toString().length, token.length);
                        }
                        else if (token === 'ss' || token === 's') {
                            ss = _this.getInteger(val, i_val, token.length, 2);
                            if (ss === null || (ss < 0) || (ss > 59)) {
                                throw 'Invalid seconds';
                            }
                            i_val += Math.max(ss.toString().length, token.length);
                        }
                        else if (token === 'sss') {
                            sss = _this.getInteger(val, i_val, 3, 3);
                            if (sss === null || (sss < 0) || (sss > 999)) {
                                throw 'Invalid milliseconds';
                            }
                            i_val += 3;
                        }
                        else if (token === 'a') {
                            if (val.substring(i_val, i_val + 2).toLowerCase() === 'am') {
                                ampm = 'AM';
                            }
                            else if (val.substring(i_val, i_val + 2).toLowerCase() === 'pm') {
                                ampm = 'PM';
                            }
                            else {
                                throw 'Invalid AM/PM';
                            }
                            i_val += 2;
                        }
                        else if (token === 'Z') {
                            parsedZ = true;
                            if (val[i_val] === 'Z') {
                                z = 0;
                                i_val += 1;
                            }
                            else {
                                if (val[i_val + 3] === ':') {
                                    var tzStr = val.substring(i_val, i_val + 6);
                                    z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(4, 2), 10);
                                    i_val += 6;
                                }
                                else {
                                    var tzStr = val.substring(i_val, i_val + 5);
                                    z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(3, 2), 10);
                                    i_val += 5;
                                }
                            }
                            if (z > 720 || z < -720) {
                                throw 'Invalid timezone';
                            }
                        }
                        else {
                            if (val.substring(i_val, i_val + token.length) !== token) {
                                throw 'Pattern value mismatch';
                            }
                            else {
                                i_val += token.length;
                            }
                        }
                    }
                    if (i_val !== val.length) {
                        throw 'Pattern value mismatch';
                    }
                    if (month === 2) {
                        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
                            if (date > 29) {
                                throw 'Invalid date';
                            }
                        }
                        else {
                            if (date > 28) {
                                throw 'Invalid date';
                            }
                        }
                    }
                    if ((month === 4) || (month === 6) || (month === 9) || (month === 11)) {
                        if (date > 30) {
                            throw 'Invalid date';
                        }
                    }
                    if (hh < 12 && ampm === 'PM') {
                        hh += 12;
                    }
                    else if (hh > 11 && ampm === 'AM') {
                        hh -= 12;
                    }
                    var localDate = new Date(year, month - 1, date, hh, mm, ss, sss);
                    if (parsedZ) {
                        return new Date(localDate.getTime() - (z + localDate.getTimezoneOffset()) * 60000);
                    }
                    return localDate;
                }
                catch (e) {
                    return undefined;
                }
            };
            this.datetimeFormats = this.$locale.DATETIME_FORMATS;
            this.monthNames = this.datetimeFormats.MONTH.concat(this.datetimeFormats.SHORTMONTH);
            this.dayNames = this.datetimeFormats.DAY.concat(this.datetimeFormats.SHORTDAY);
            this.cache = [];
        }
        DateParser.prototype.getInteger = function (input, startPoint, minLength, maxLength) {
            var val = input.substring(startPoint);
            var key = minLength + "_" + maxLength;
            var matcher = this.cache[key];
            if (!matcher) {
                matcher = new RegExp("^(\\d{" + minLength + "," + maxLength + "})");
                this.cache[key] = matcher;
            }
            var match = matcher.exec(val);
            if (match) {
                return Number(match[1]);
            }
            return null;
        };
        DateParser.factory = function () {
            var factory = function ($locale) {
                var instance = new DateParser($locale);
                return function (val, format) { return instance.parse(val, format); };
            };
            factory.$inject = ['$locale'];
            return factory;
        };
        return DateParser;
    }());
    angular.module('dateParser', [])
        .factory('$dateParser', DateParser.factory());
})(NgDateParser || (NgDateParser = {}));
var NgDateParser;
(function (NgDateParser) {
    var DateParserDirective = (function () {
        function DateParserDirective(dateFilter, $dateParser) {
            var _this = this;
            this.dateFilter = dateFilter;
            this.$dateParser = $dateParser;
            this.restrict = 'A';
            this.require = 'ngModel';
            this.scope = {
                ngModel: '='
            };
            this.link = function ($scope, element, attrs, ngModel) {
                var dateFormat;
                attrs.$observe('dateParser', function (value) {
                    dateFormat = value;
                    ngModel.$render();
                });
                ngModel.$parsers.unshift(function (viewValue) {
                    var date = _this.$dateParser(viewValue, dateFormat);
                    ngModel.$setValidity('date', !viewValue || angular.isDate(date));
                    return date;
                });
                ngModel.$render = function () {
                    var modelValueExists = ngModel.$modelValue === '' || ngModel.$modelValue === null || ngModel.$modelValue;
                    element.val(modelValueExists ? _this.dateFilter(ngModel.$modelValue, dateFormat) : undefined);
                    _this.scope.ngModel = ngModel.$modelValue;
                };
                ngModel.$formatters.push(function (modelValue) {
                    ngModel.$setValidity('date', !modelValue || angular.isDate(modelValue));
                    return angular.isDate(modelValue) ? _this.dateFilter(modelValue, dateFormat) : '';
                });
            };
        }
        DateParserDirective.factory = function () {
            var directive = function (dateFilter, $dateParser) { return new DateParserDirective(dateFilter, $dateParser); };
            directive.$inject = ['dateFilter', '$dateParser'];
            return directive;
        };
        return DateParserDirective;
    }());
    angular.module('dateParser')
        .directive('dateParser', DateParserDirective.factory());
})(NgDateParser || (NgDateParser = {}));

//# sourceMappingURL=angular-dateparser.js.map
