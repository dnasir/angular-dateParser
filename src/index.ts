import * as ng from 'angular';
import { DateParser } from './DateParser';
import { DateParserDirective } from './DateParserDirective';

ng.module('dateParser', [])
    .provider('$dateParser', DateParser)
    .directive('dateParser', DateParserDirective.factory());