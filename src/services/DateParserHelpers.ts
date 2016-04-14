///<reference path="../all.d.ts"/>

module NgDateParser {
    export interface IDateParserHelpers {
        getInteger(input: string, startPoint: number, minLength: number, maxLength: number): number;
    }
    
    export class DateParserHelpers implements IDateParserHelpers {
        'use strict';

        private cache: string[];
        
        constructor() {
            this.cache = [];
        }

        getInteger(input: string, startPoint: number, minLength: number, maxLength: number): number {
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
    }
}