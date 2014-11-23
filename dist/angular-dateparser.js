/*!
 * angular-dateParser 1.0.12
 * https://github.com/dnasir/angular-dateParser
 * Copyright 2014, Dzulqarnain Nasir
 * Licensed under: MIT (http://www.opensource.org/licenses/MIT)
 */

(function(angular) {
    angular.module("dateParser", []).factory("dateParserHelpers", [ function() {
        "use strict";
        var cache = {};
        return {
            getInteger: function(string, startPoint, minLength, maxLength) {
                var val = string.substring(startPoint);
                var matcher = cache[minLength + "_" + maxLength];
                if (!matcher) {
                    matcher = new RegExp("^(\\d{" + minLength + "," + maxLength + "})");
                    cache[minLength + "_" + maxLength] = matcher;
                }
                var match = matcher.exec(val);
                if (match) {
                    return match[1];
                }
                return null;
            }
        };
    } ]).factory("$dateParser", [ "$locale", "dateParserHelpers", function($locale, dateParserHelpers) {
        "use strict";
        var datetimeFormats = $locale.DATETIME_FORMATS;
        var monthNames = datetimeFormats.MONTH.concat(datetimeFormats.SHORTMONTH);
        var dayNames = datetimeFormats.DAY.concat(datetimeFormats.SHORTDAY);
        return function(val, format) {
            if (angular.isDate(val)) {
                return val;
            }
            try {
                val = val + "";
                format = format + "";
                if (!format.length) {
                    return new Date(val);
                }
                if (datetimeFormats[format]) {
                    format = datetimeFormats[format];
                }
                var now = new Date(), i_val = 0, i_format = 0, format_token = "", year = now.getFullYear(), month = now.getMonth() + 1, date = now.getDate(), hh = 0, mm = 0, ss = 0, sss = 0, ampm = "am", z = 0, parsedZ = false;
                while (i_format < format.length) {
                    format_token = format.charAt(i_format);
                    var token = "";
                    if (format.charAt(i_format) == "'") {
                        var _i_format = i_format;
                        while (format.charAt(++i_format) != "'" && i_format < format.length) {
                            token += format.charAt(i_format);
                        }
                        if (val.substring(i_val, i_val + token.length) != token) {
                            throw "Pattern value mismatch";
                        }
                        i_val += token.length;
                        i_format++;
                        continue;
                    }
                    while (format.charAt(i_format) == format_token && i_format < format.length) {
                        token += format.charAt(i_format++);
                    }
                    if (token == "yyyy" || token == "yy" || token == "y") {
                        var minLength, maxLength;
                        if (token == "yyyy") {
                            minLength = 4;
                            maxLength = 4;
                        }
                        if (token == "yy") {
                            minLength = 2;
                            maxLength = 2;
                        }
                        if (token == "y") {
                            minLength = 2;
                            maxLength = 4;
                        }
                        year = dateParserHelpers.getInteger(val, i_val, minLength, maxLength);
                        if (year === null) {
                            throw "Invalid year";
                        }
                        i_val += year.length;
                        if (year.length == 2) {
                            if (year > 70) {
                                year = 1900 + (year - 0);
                            } else {
                                year = 2e3 + (year - 0);
                            }
                        }
                    } else if (token === "MMMM" || token == "MMM") {
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
                        if (month < 1 || month > 12) {
                            throw "Invalid month";
                        }
                    } else if (token == "EEEE" || token == "EEE") {
                        for (var j = 0; j < dayNames.length; j++) {
                            var day_name = dayNames[j];
                            if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                                i_val += day_name.length;
                                break;
                            }
                        }
                    } else if (token == "MM" || token == "M") {
                        month = dateParserHelpers.getInteger(val, i_val, token.length, 2);
                        if (month === null || month < 1 || month > 12) {
                            throw "Invalid month";
                        }
                        i_val += month.length;
                    } else if (token == "dd" || token == "d") {
                        date = dateParserHelpers.getInteger(val, i_val, token.length, 2);
                        if (date === null || date < 1 || date > 31) {
                            throw "Invalid date";
                        }
                        i_val += date.length;
                    } else if (token == "HH" || token == "H") {
                        hh = dateParserHelpers.getInteger(val, i_val, token.length, 2);
                        if (hh === null || hh < 0 || hh > 23) {
                            throw "Invalid hours";
                        }
                        i_val += hh.length;
                    } else if (token == "hh" || token == "h") {
                        hh = dateParserHelpers.getInteger(val, i_val, token.length, 2);
                        if (hh === null || hh < 1 || hh > 12) {
                            throw "Invalid hours";
                        }
                        i_val += hh.length;
                    } else if (token == "mm" || token == "m") {
                        mm = dateParserHelpers.getInteger(val, i_val, token.length, 2);
                        if (mm === null || mm < 0 || mm > 59) {
                            throw "Invalid minutes";
                        }
                        i_val += mm.length;
                    } else if (token == "ss" || token == "s") {
                        ss = dateParserHelpers.getInteger(val, i_val, token.length, 2);
                        if (ss === null || ss < 0 || ss > 59) {
                            throw "Invalid seconds";
                        }
                        i_val += ss.length;
                    } else if (token === "sss") {
                        sss = dateParserHelpers.getInteger(val, i_val, 3, 3);
                        if (sss === null || sss < 0 || sss > 999) {
                            throw "Invalid milliseconds";
                        }
                        i_val += 3;
                    } else if (token == "a") {
                        if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                            ampm = "AM";
                        } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                            ampm = "PM";
                        } else {
                            throw "Invalid AM/PM";
                        }
                        i_val += 2;
                    } else if (token == "Z") {
                        parsedZ = true;
                        if (val[i_val] === "Z") {
                            z = 0;
                            i_val += 1;
                        } else {
                            if (val[i_val + 3] === ":") {
                                var tzStr = val.substring(i_val, i_val + 6);
                                z = parseInt(tzStr.substr(0, 3), 10) * 60 + parseInt(tzStr.substr(4, 2), 10);
                                i_val += 6;
                            } else {
                                var tzStr = val.substring(i_val, i_val + 5);
                                z = parseInt(tzStr.substr(0, 3), 10) * 60 + parseInt(tzStr.substr(3, 2), 10);
                                i_val += 5;
                            }
                        }
                        if (z > 720 || z < -720) {
                            throw "Invalid timezone";
                        }
                    } else {
                        if (val.substring(i_val, i_val + token.length) != token) {
                            throw "Pattern value mismatch";
                        } else {
                            i_val += token.length;
                        }
                    }
                }
                if (i_val != val.length) {
                    throw "Pattern value mismatch";
                }
                year = parseInt(year, 10);
                month = parseInt(month, 10);
                date = parseInt(date, 10);
                hh = parseInt(hh, 10);
                mm = parseInt(mm, 10);
                ss = parseInt(ss, 10);
                sss = parseInt(sss, 10);
                if (month == 2) {
                    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                        if (date > 29) {
                            throw "Invalid date";
                        }
                    } else {
                        if (date > 28) {
                            throw "Invalid date";
                        }
                    }
                }
                if (month == 4 || month == 6 || month == 9 || month == 11) {
                    if (date > 30) {
                        throw "Invalid date";
                    }
                }
                if (hh < 12 && ampm == "PM") {
                    hh += 12;
                } else if (hh > 11 && ampm == "AM") {
                    hh -= 12;
                }
                var localDate = new Date(year, month - 1, date, hh, mm, ss, sss);
                if (parsedZ) {
                    return new Date(localDate.getTime() - (z + localDate.getTimezoneOffset()) * 6e4);
                }
                return localDate;
            } catch (e) {
                return undefined;
            }
        };
    } ]);
    angular.module("dateParser").directive("dateParser", [ "dateFilter", "$dateParser", function(dateFilter, $dateParser) {
        "use strict";
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {
                var dateFormat;
                attrs.$observe("dateParser", function(value) {
                    dateFormat = value;
                    ngModel.$render();
                });
                ngModel.$parsers.unshift(function(viewValue) {
                    var date = $dateParser(viewValue, dateFormat);
                    ngModel.$setValidity("date", angular.isDate(date));
                    return date;
                });
                ngModel.$render = function() {
                    element.val(ngModel.$modelValue ? dateFilter(ngModel.$modelValue, dateFormat) : undefined);
                    scope.ngModel = ngModel.$modelValue;
                };
                ngModel.$formatters.push(function(modelValue) {
                    ngModel.$setValidity("date", angular.isDate(modelValue));
                    return modelValue ? dateFilter(modelValue, dateFormat) : "";
                });
            }
        };
    } ]);
})(angular);