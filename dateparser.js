/* 
 *   Angular DateParser 1.0.2
 *   https://github.com/dnasir/angular-dateParser
 *
 *   Copyright 2013, Dzulqarnain Nasir
 *   http://www.dnasir.com
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */

angular.module('dateParser', [])
    .factory('$dateParser', ['$locale', '$log', function($locale, $log) {

        // Fetch date and time formats from $locale service
        var datetimeFormats = $locale.DATETIME_FORMATS;

        // Build array of month and day names
        var monthNames = datetimeFormats.MONTH.concat(datetimeFormats.SHORTMONTH);
        var dayNames = datetimeFormats.DAY.concat(datetimeFormats.SHORTDAY);

        var isInteger = function(val) {
            var digits="1234567890";
            for (var i=0; i < val.length; i++) {
                if (digits.indexOf(val.charAt(i))==-1) return false;
            }
            return true;
        };

        var getInt = function(str, i, minlength, maxlength) {
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (isInteger(token)) {
                    return token;
                }
            }
            return null;
        };

        return function(val, format) {
            try {
                val = val + '';
                format = format + '';

                // If no format is provided, just pass it to the Date constructor
                if(!format.length) {
                    return new Date(val);
                }

                // Check if format exists in the format collection
                if (datetimeFormats[format]) {
                    format = datetimeFormats[format];
                }

                var i_val = 0,
                    i_format = 0,
                    c = '',
                    x,
                    y,
                    now = new Date(),
                    year = now.getFullYear(),
                    month = now.getMonth() + 1,
                    date = now.getDate(),
                    hh = 0,
                    mm = 0,
                    ss = 0,
                    ampm = '';

                while (i_format < format.length) {
                    // Get next token from format string
                    c = format.charAt(i_format);

                    var token = '';

                    // Handle quote marks for strings within format string
                    if(format.charAt(i_format) == "'") {
                        var _i_format = i_format;

                        while((format.charAt(++i_format) != "'") && (i_format < format.length)) {
                            token += format.charAt(i_format);
                        }

                        if(val.substring(i_val, i_val + token.length) != token) {
                            throw 'Pattern value mismatch';
                        }

                        i_val += token.length;
                        i_format++;

                        continue;
                    }

                    while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                        token += format.charAt(i_format++);
                    }

                    // Extract contents of value based on format token
                    // TODO: Implement timezone offset (Z) extractor
                    // TODO: Implement millisecond (.sss or ,sss) extractor
                    if (token == 'yyyy' || token == 'yy' || token == 'y') {
                        if (token == 'yyyy') {
                            x = 4;
                            y = 4;
                        }
                        if (token == 'yy') {
                            x = 2;
                            y = 2;
                        }
                        if (token == 'y') {
                            x = 2;
                            y = 4;
                        }
                        year = getInt(val, i_val, x, y);
                        if (year === null) {
                            throw 'Invalid year';
                        }
                        i_val += year.length;
                        if (year.length == 2) {
                            if (year > 70) {
                                year = 1900 + (year - 0);
                            } else {
                                year = 2000 + (year - 0);
                            }
                        }
                    } else if (token === 'MMMM' || token == 'MMM') {
                        month = 0;
                        for (var i = 0; i < monthNames.length; i++) {
                            var month_name = monthNames[i];
                            if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
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
                    } else if (token == 'EEEE' || token == 'EEE') {
                        for (var j = 0; j < dayNames.length; j++) {
                            var day_name = dayNames[j];
                            if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                                i_val += day_name.length;
                                break;
                            }
                        }
                    } else if (token == 'MM' || token == 'M') {
                        month = getInt(val, i_val, token.length, 2);
                        if (month === null || (month < 1) || (month > 12)) {
                            throw 'Invalid month';
                        }
                        i_val += month.length;
                    } else if (token == 'dd' || token == 'd') {
                        date = getInt(val, i_val, token.length, 2);
                        if (date === null || (date < 1) || (date > 31)) {
                            throw 'Invalid date';
                        }
                        i_val += date.length;
                    } else if (token == 'HH' || token == 'H') {
                        hh = getInt(val, i_val, token.length, 2);
                        if (hh === null || (hh < 0) || (hh > 23)) {
                            throw 'Invalid hours';
                        }
                        i_val += hh.length;
                    } else if (token == 'hh' || token == 'h') {
                        hh = getInt(val, i_val, token.length, 2);
                        if (hh === null || (hh < 1) || (hh > 12)) {
                            throw 'Invalid hours';
                        }
                        i_val += hh.length;
                    } else if (token == 'mm' || token == 'm') {
                        mm = getInt(val, i_val, token.length, 2);
                        if (mm === null || (mm < 0) || (mm > 59)) {
                            throw 'Invalid minutes';
                        }
                        i_val += mm.length;
                    } else if (token == 'ss' || token == 's') {
                        ss = getInt(val, i_val, token.length, 2);
                        if (ss === null || (ss < 0) || (ss > 59)) {
                            throw 'Invalid seconds';
                        }
                        i_val += ss.length;
                    } else if (token == 'a') {
                        if (val.substring(i_val, i_val + 2).toLowerCase() == 'am') {
                            ampm = 'AM';
                        } else if (val.substring(i_val, i_val + 2).toLowerCase() == 'pm') {
                            ampm = 'PM';
                        } else {
                            throw 'Invalid AM/PM';
                        }
                        i_val += 2;
                    } else {
                        if (val.substring(i_val, i_val + token.length) != token) {
                            throw 'Pattern value mismatch';
                        } else {
                            i_val += token.length;
                        }
                    }
                }
                // If there are any trailing characters left in the value, it doesn't match
                if (i_val != val.length) {
                    throw 'Pattern value mismatch';
                }

                // TODO: Not sure if this is still required
                // Is date valid for month?
                if (month == 2) {
                    // Check for leap year
                    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) { // leap year
                        if (date > 29) {
                            throw 'Invalid date';
                        }
                    } else {
                        if (date > 28) {
                            throw 'Invalid date';
                        }
                    }
                }
                if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                    if (date > 30) {
                        throw 'Invalid date';
                    }
                }

                // Correct hours value
                if (hh < 12 && ampm == 'PM') {
                    hh = hh - 0 + 12;
                } else if (hh > 11 && ampm == 'AM') {
                    hh -= 12;
                }

                return new Date(year, month - 1, date, hh, mm, ss);
            } catch(e) {
                $log.error(e);

                return new Date(undefined);
            }
        };
    }])
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