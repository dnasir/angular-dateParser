describe('dateParser', function() {
    var $scope, $compile;

    beforeEach(module('dateParser'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
    }));

    it('should convert string to Date object using provided formats', inject(function($dateParser) {
        var str1 = '17.12.2013',
            str2 = '17-12-2013 12:59',
            str3 = 'December 17, 2013 12:59',
            str4 = '4:15 in the morning';

        var format1 = 'dd.MM.yyyy',
            format2 = 'dd-MM-yyyy HH:mm',
            format3 = 'MMMM d, yyyy HH:mm',
            format4 = "h:m 'in the morning'";

        var expected1 = new Date(2013, 11, 17, 0, 0, 0),
            expected2 = new Date(2013, 11, 17, 12, 59, 0),
            expected3 = new Date(2013, 11, 17, 12, 59, 0);

        expect($dateParser(str1, format1).getTime()).toBe(expected1.getTime());
        expect($dateParser(str2, format2).getTime()).toBe(expected2.getTime());
        expect($dateParser(str3, format3).getTime()).toBe(expected3.getTime());

        var result4 = $dateParser(str4, format4);
        expect(result4.getHours()).toBe(4);
        expect(result4.getMinutes()).toBe(15);
    }));

    it('should properly parse timezones', inject(function($dateParser) {
        var str1 = 'December 17, 2013 12:59 +0300',
            str2 = 'December 17, 2013 12:59 -0300';

        var format = 'MMMM d, yyyy HH:mm Z';

        var expectedBase = new Date(2013, 11, 17, 12, 59, 0),
            expected1 = new Date(expectedBase.getTime() + (180 + expectedBase.getTimezoneOffset()) * 60 * 1000),
            expected2 = new Date(expectedBase.getTime() + (-180 + expectedBase.getTimezoneOffset()) * 60 * 1000);

        expect($dateParser(str1, format).getTime()).toBe(expected1.getTime());
        expect($dateParser(str2, format).getTime()).toBe(expected2.getTime());
    }));

    it('should return Invalid Date for invalid date strings', inject(function($dateParser) {
        var str1 = '29.02.2013',
            str2 = '31-04-2013',
            str3 = 'November 31, 2013';

        var format1 = 'dd.MM.yyyy',
            format2 = 'dd-MM-yyyy',
            format3 = 'MMMM d, yyyy';

        expect(isNaN($dateParser(str1, format1))).toBe(true);
        expect(isNaN($dateParser(str2, format2))).toBe(true);
        expect(isNaN($dateParser(str3, format3))).toBe(true);
    }));

    describe('using various format strings', function() {

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

            expect(converted.getTime()).toBe(dateObj.getTime());
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

            expect(converted.getTime()).toBe(dateObj.getTime());
        }));
    });
});