import * as angular from 'angular';
import 'angular-mocks';

describe('dateParser', function() {

    beforeEach(angular.mock.module('dateParser'));

    describe('manual formats', function() {
        it('should convert string to Date object using provided formats', inject(function($dateParser) {
            var str1 = '17.12.2013',
                str2 = '17-12-2013 12:59',
                str3 = 'December 17, 2013 12:59',
                str4 = '4:15 in the morning',
                str5 = '4/3/2014 10:45:45.345',
                str6 = 'November 8, 1983 9:55pm',
                str7 = '2011-04-01';

            var format1 = 'dd.MM.yyyy',
                format2 = 'dd-MM-yyyy HH:mm',
                format3 = 'MMMM d, yyyy HH:mm',
                format4 = "h:m 'in the morning'",
                format5 = 'd/M/yyyy H:mm:ss.sss',
                format6 = 'MMMM d, yyyy h:mma',
                format7 = 'yy-MMMM-dd';

            var expected1 = new Date(2013, 11, 17, 0, 0, 0),
                expected2 = new Date(2013, 11, 17, 12, 59, 0),
                expected3 = new Date(2013, 11, 17, 12, 59, 0),
                expected5 = new Date(2014, 2, 4, 10, 45, 45, 345),
                expected6 = new Date(1983, 10, 8, 21, 55, 0);

            expect($dateParser(str1, format1).getTime()).toBe(expected1.getTime());
            expect($dateParser(str2, format2).getTime()).toBe(expected2.getTime());
            expect($dateParser(str3, format3).getTime()).toBe(expected3.getTime());

            var result4 = $dateParser(str4, format4);
            expect(result4.getHours()).toBe(4);
            expect(result4.getMinutes()).toBe(15);

            expect($dateParser(str5, format5).getTime()).toBe(expected5.getTime());
            expect($dateParser(str6, format6).getTime()).toBe(expected6.getTime());
            expect($dateParser(str7, format7)).toBe(undefined);
        }));

        it('should properly parse +hhmm timezones', inject(function($dateParser) {
            var str1 = 'December 17, 2013 12:59 +0300',
                str2 = 'April 17, 2013 12:59 -0300',
                str3 = 'December 17, 2013 12:59 +1300',
                str4 = 'January 1, 2020 23:59 +1200',
                str5 = 'July 1, 2020 23:59 -0700',
                str6 = 'November 8, 1983 09:59 +0530';

            var format = 'MMMM d, yyyy HH:mm Z';

            expect($dateParser(str1, format).getUTCHours()).toBe(9);
            expect($dateParser(str2, format).getUTCHours()).toBe(15);
            expect($dateParser(str3, format)).toBe(undefined);
            expect($dateParser(str4, format).getUTCHours()).toBe(11);
            expect($dateParser(str5, format).getUTCHours()).toBe(6);
            expect($dateParser(str6, format).getUTCHours()).toBe(4);
            expect($dateParser(str6, format).getUTCMinutes()).toBe(29);
        }));

        it('should properly parse +hh:mm timezones', inject(function($dateParser) {
            var str1 = 'December 17, 2013 12:59 +03:00',
                str2 = 'April 17, 2013 12:59 -03:00',
                str3 = 'December 17, 2013 12:59 +13:00',
                str4 = 'January 1, 2020 23:59 +12:00',
                str5 = 'July 1, 2020 23:59 -07:00',
                str6 = 'November 8, 1983 09:59 +05:30';

            var format = 'MMMM d, yyyy HH:mm Z';

            expect($dateParser(str1, format).getUTCHours()).toBe(9);
            expect($dateParser(str2, format).getUTCHours()).toBe(15);
            expect($dateParser(str3, format)).toBe(undefined);
            expect($dateParser(str4, format).getUTCHours()).toBe(11);
            expect($dateParser(str5, format).getUTCHours()).toBe(6);
            expect($dateParser(str6, format).getUTCHours()).toBe(4);
            expect($dateParser(str6, format).getUTCMinutes()).toBe(29);
        }));

        it('should properly parse UTC timezones', inject(function($dateParser) {
            var str1 = 'December 17, 2013 12:59 Z',
                str2 = 'April 17, 2013 23:59 Z';

            var format = 'MMMM d, yyyy HH:mm Z';

            expect($dateParser(str1, format).getUTCHours()).toBe(12);
            expect($dateParser(str2, format).getUTCHours()).toBe(23);
        }));

        it('should return undefined for invalid date strings and pattern mismatches', inject(function($dateParser) {
            var str1 = '29.02.2013',
                str2 = '31-04-2013',
                str3 = 'November 31, 2013',
                str4 = '12/12/2012';

            var format1 = 'dd.MM.yyyy',
                format2 = 'dd-MM-yyyy',
                format3 = 'MMMM d, yyyy',
                format4 = 'dd/MMMM/yy';

            expect($dateParser(str1, format1)).toBe(undefined);
            expect($dateParser(str2, format2)).toBe(undefined);
            expect($dateParser(str3, format3)).toBe(undefined);
            expect($dateParser(str4, format4)).toBe(undefined);
        }));
        
        it('should be able to parse week numbers', inject(function($dateParser) {
            var str1 = "Week 16 of 2016 00:00:00.000",
                str2 = "Week 40 of 2011",
                str3 = "Week 60 of 2016",
                str4 = "23 April is in week 16 of 2016",
                str5 = "23 April is in week 20 of 2016"
            
            var format1 = "'Week' w 'of' yyyy HH:mm:ss.sss",
                format2 = "'Week' w 'of' yyyy",
                format4 = "d MMMM 'is in week' w 'of' yyyy"
            
            var expected1 = new Date(2016, 3, 18, 0, 0, 0, 0),
                expected2 = new Date(2011, 9, 3, 0, 0, 0, 0),
                expected4 = new Date(2016, 3, 23, 0, 0, 0, 0)
            
            expect($dateParser(str1, format1).getTime()).toBe(expected1.getTime());
            expect($dateParser(str2, format2).getTime()).toBe(expected2.getTime());
            expect($dateParser(str3, format2)).toBeUndefined();
            expect($dateParser(str4, format4).getTime()).toBe(expected4.getTime());
            expect($dateParser(str5, format4)).toBeUndefined();
            
        }));
    });

    describe('Angular formats', function() {
        it('fullDate', inject(function($dateParser) {
            var stringToConvert = 'Tuesday, December 17, 2013',
                format = 'fullDate',
                dateObj = new Date(2013, 11, 17, 0, 0, 0);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getTime()).toBe(dateObj.getTime());
        }));

        it('longDate', inject(function($dateParser) {
            var stringToConvert = 'December 17, 2013',
                format = 'longDate',
                dateObj = new Date(2013, 11, 17, 0, 0, 0);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getTime()).toBe(dateObj.getTime());
        }));

        it('mediumDate', inject(function($dateParser) {
            var stringToConvert = 'Dec 17, 2013',
                format = 'mediumDate',
                dateObj = new Date(2013, 11, 17, 0, 0, 0);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getTime()).toBe(dateObj.getTime());
        }));

        it('shortDate', inject(function($dateParser) {
            var stringToConvert = '12/17/13',
                format = 'shortDate',
                dateObj = new Date(2013, 11, 17, 0, 0, 0);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getTime()).toBe(dateObj.getTime());
        }));

        it('medium', inject(function($dateParser) {
            var stringToConvert = 'Dec 17, 2013 12:59:59 pm',
                format = 'medium',
                dateObj = new Date(2013, 11, 17, 12, 59, 59);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getTime()).toBe(dateObj.getTime());
        }));

        it('short', inject(function($dateParser) {
            var stringToConvert = '12/17/13 12:59 pm',
                format = 'short',
                dateObj = new Date(2013, 11, 17, 12, 59, 0);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getTime()).toBe(dateObj.getTime());
        }));

        it('mediumTime', inject(function($dateParser) {
            var stringToConvert = '12:59:59 pm',
                format = 'mediumTime',
                dateObj = new Date();

            dateObj.setHours(12);
            dateObj.setMinutes(59);
            dateObj.setSeconds(59);
            dateObj.setMilliseconds(0);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getHours()).toBe(dateObj.getHours());
            expect(converted.getMinutes()).toBe(dateObj.getMinutes());
            expect(converted.getSeconds()).toBe(dateObj.getSeconds());
        }));

        it('shortTime', inject(function($dateParser) {
            var stringToConvert = '12:59 pm',
                format = 'shortTime',
                dateObj = new Date();

            dateObj.setHours(12);
            dateObj.setMinutes(59);
            dateObj.setSeconds(0);
            dateObj.setMilliseconds(0);

            var converted = $dateParser(stringToConvert, format);

            expect(converted.getHours()).toBe(dateObj.getHours());
            expect(converted.getMinutes()).toBe(dateObj.getMinutes());
            expect(converted.getSeconds()).toBe(dateObj.getSeconds());
        }));
    });

    describe('misc tests', function() {
        it('should just return the input value if it is a Date object', inject(function($dateParser) {
            var dateObj = new Date();

            expect($dateParser(dateObj)).toEqual(dateObj);
        }));
    });
});