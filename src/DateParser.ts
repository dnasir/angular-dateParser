import * as angular from 'angular';

export interface IDateParser {
    (val: any, format?: string): Date;
}

export class DateParser implements angular.IServiceProvider {
    private $dateFilter: angular.IFilterDate;
    private $locale: angular.ILocaleService;
    private datetimeFormats: angular.ILocaleDateTimeFormatDescriptor;
    private monthNames: string[];
    private dayNames: string[];
    private cache: string[];
    private _watchLocale: boolean;

    constructor() {
        // Regex pattern cache
        this.cache = [];
        this._watchLocale = false;
        this.$get.$inject = ['$filter', '$locale', '$rootScope'];
    }

    updateFromLocale() {
        this.datetimeFormats = this.$locale.DATETIME_FORMATS;
        this.monthNames = this.datetimeFormats.MONTH.concat(this.datetimeFormats.SHORTMONTH);
        this.dayNames = this.datetimeFormats.DAY.concat(this.datetimeFormats.SHORTDAY);
    }

    watchLocale(watch?: boolean) {
        if (angular.isDefined(watch)) {
            this._watchLocale = watch;
        } else {
            return this._watchLocale;
        }
    }

    $get = ($filter: angular.IFilterService, $locale: angular.ILocaleService, $rootScope: angular.IRootScopeService) => {
        this.$locale = $locale;
        this.$dateFilter = $filter('date');

        this.updateFromLocale();

        if (this._watchLocale) {
            $rootScope.$watchCollection(() => $locale, () => {
                this.updateFromLocale();
            });
        }

        return this.parse;
    }

    private parse: IDateParser = (val: any, format?: string): Date => {
        // if it's a Date object, return as-is
        if (angular.isDate(val)) {
            return val;
        }

        // if it's anything other than a string, reject it
        if (!angular.isString(val)) {
            return undefined;
        }

        try {
            // If no format is provided, just pass it to the Date constructor
            if (!format.length) {
                return new Date(val);
            }

            // Check if format exists in the format collection
            if (this.datetimeFormats != null && this.datetimeFormats[format]) {
                format = this.datetimeFormats[format];
            }

            // Initial values
            var now = new Date(),
                i_val = 0,
                i_format = 0,
                format_token = '',
                year = null,
                week = null,
                month = null,
                date = null,
                hh = 0,
                mm = 0,
                ss = 0,
                sss = 0,
                ampm = 'am',
                z = 0,
                parsedZ = false;

            // FIX: don't take the current date, it could have a day of the month that is higher than the parsed date
            // example: parse "February 2013" with the current date of "30 April 2013"
            now = new Date(now.getFullYear(), now.getMonth(), 1);

            // TODO: Extract this into a helper function perhaps?
            while (i_format < format.length) {
                // Get next token from format string
                format_token = format.charAt(i_format);

                var token = '';

                // TODO: Handle double single quotes
                // Handle quote marks for strings within format string
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

                // Extract contents of value based on format token
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

                    year = this.getInteger(val, i_val, minLength, maxLength);

                    if (year === null) {
                        throw 'Invalid year';
                    }

                    i_val += Math.max(year.toString().length, token.length);

                    if (year.toString().length === 2) {
                        if (year > 70) {
                            year = 1900 + (year - 0);
                        } else {
                            year = 2000 + (year - 0);
                        }
                    }
                } else if (token === 'ww' || token === 'w') {
                    week = this.getInteger(val, i_val, token.length, 2);

                    i_val += Math.max(week.toString().length, token.length);
                } else if (token === 'MMMM' || token === 'MMM') {
                    month = 0;

                    for (var i = 0; i < this.monthNames.length; i++) {
                        var month_name = this.monthNames[i];

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
                } else if (token === 'EEEE' || token === 'EEE') {
                    for (var j = 0; j < this.dayNames.length; j++) {
                        var day_name = this.dayNames[j];

                        if (val.substring(i_val, i_val + day_name.length).toLowerCase() === day_name.toLowerCase()) {
                            i_val += day_name.length;
                            break;
                        }
                    }
                } else if (token === 'MM' || token === 'M') {
                    month = this.getInteger(val, i_val, token.length, 2);

                    if (month === null || (month < 1) || (month > 12)) {
                        throw 'Invalid month';
                    }

                    i_val += Math.max(month.toString().length, token.length);
                } else if (token === 'dd' || token === 'd') {
                    date = this.getInteger(val, i_val, token.length, 2);

                    if (date === null || (date < 1) || (date > 31)) {
                        throw 'Invalid date';
                    }

                    i_val += Math.max(date.toString().length, token.length);
                } else if (token === 'HH' || token === 'H') {
                    hh = this.getInteger(val, i_val, token.length, 2);

                    if (hh === null || (hh < 0) || (hh > 23)) {
                        throw 'Invalid hours';
                    }

                    i_val += Math.max(hh.toString().length, token.length);
                } else if (token === 'hh' || token === 'h') {
                    hh = this.getInteger(val, i_val, token.length, 2);

                    if (hh === null || (hh < 1) || (hh > 12)) {
                        throw 'Invalid hours';
                    }

                    i_val += Math.max(hh.toString().length, token.length);
                } else if (token === 'mm' || token === 'm') {
                    mm = this.getInteger(val, i_val, token.length, 2);

                    if (mm === null || (mm < 0) || (mm > 59)) {
                        throw 'Invalid minutes';
                    }

                    i_val += Math.max(mm.toString().length, token.length);
                } else if (token === 'ss' || token === 's') {
                    ss = this.getInteger(val, i_val, token.length, 2);

                    if (ss === null || (ss < 0) || (ss > 59)) {
                        throw 'Invalid seconds';
                    }

                    i_val += Math.max(ss.toString().length, token.length);
                } else if (token === 'sss') {
                    sss = this.getInteger(val, i_val, 3, 3);

                    if (sss === null || (sss < 0) || (sss > 999)) {
                        throw 'Invalid milliseconds';
                    }

                    i_val += 3;
                } else if (token === 'a') {
                    if (val.substring(i_val, i_val + 2).toLowerCase() === 'am') {
                        ampm = 'AM';
                    } else if (val.substring(i_val, i_val + 2).toLowerCase() === 'pm') {
                        ampm = 'PM';
                    } else {
                        throw 'Invalid AM/PM';
                    }

                    i_val += 2;
                } else if (token === 'Z') {
                    parsedZ = true;

                    if (val[i_val] === 'Z') {
                        z = 0;

                        i_val += 1;
                    } else {
                        if (val[i_val + 3] === ':') {
                            var tzStr = val.substring(i_val, i_val + 6);

                            z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(4, 2), 10);

                            i_val += 6;
                        } else {
                            var tzStr = val.substring(i_val, i_val + 5);

                            z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(3, 2), 10);

                            i_val += 5;
                        }
                    }

                    if (z > 720 || z < -720) {
                        throw 'Invalid timezone';
                    }
                } else {
                    if (val.substring(i_val, i_val + token.length) !== token) {
                        throw 'Pattern value mismatch';
                    } else {
                        i_val += token.length;
                    }
                }
            }

            // If there are any trailing characters left in the value, it doesn't match
            if (i_val !== val.length) {
                throw 'Pattern value mismatch';
            }

            // Is date valid for month?
            if (month === 2) {
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

            if ((month === 4) || (month === 6) || (month === 9) || (month === 11)) {
                if (date > 30) {
                    throw 'Invalid date';
                }
            }

            // Correct hours value
            if (hh < 12 && ampm === 'PM') {
                hh += 12;
            } else if (hh > 11 && ampm === 'AM') {
                hh -= 12;
            }

            var localDate = new Date(year || now.getFullYear(), (month !== null ? month - 1 : now.getMonth()), date || now.getDate(), hh, mm, ss, sss);
            if (week !== null) {
                var dateFromISOWeek = this.getDateOfISOWeek(week, year || now.getFullYear(), month, date);
                if (dateFromISOWeek) {
                    if (month !== null) {
                        dateFromISOWeek.setMonth(month - 1);
                    }
                    if (date !== null) {
                        dateFromISOWeek.setDate(date);
                    }

                    dateFromISOWeek.setHours(hh);
                    dateFromISOWeek.setMinutes(mm);
                    dateFromISOWeek.setSeconds(ss);
                    dateFromISOWeek.setMilliseconds(sss);

                    localDate = dateFromISOWeek;
                } else {
                    throw 'Invalid week number or week number/date mismatch';
                }
            }

            if (parsedZ) {
                return new Date(localDate.getTime() - (z + localDate.getTimezoneOffset()) * 60000);
            }

            return localDate;
        } catch (e) {
            console.info(e);
            return undefined;
        }
    }

    private getInteger(input: string, startPoint: number, minLength: number, maxLength: number): number {
        var val = input.substring(startPoint);
        var key = `${minLength}_${maxLength}`;
        var matcher = this.cache[key];
        if (!matcher) {
            matcher = new RegExp(`^(\\d{${minLength},${maxLength}})`);
            this.cache[key] = matcher;
        }

        var match = matcher.exec(val);
        if (match) {
            return Number(match[1]);
        }
        return null;
    }

    private getDateOfISOWeek(week: number, year: number, month?: number, date?: number): Date {
        if (week < 1) return undefined;

        var simple = new Date(year, 0, 1 + (week - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;

        if (dow <= 4) {
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        } else {
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        }

        if (ISOweekStart.getFullYear() !== year) {
            return undefined;
        }

        if (month !== null) {
            if (ISOweekStart.getMonth() !== month - 1) {
                return undefined;
            }
        }

        if (date !== null) {
            var isoWeekDate = ISOweekStart.getDate();
            if (date < isoWeekDate && date > isoWeekDate + 6) {
                return undefined;
            }
        }

        return ISOweekStart;
    }
}
