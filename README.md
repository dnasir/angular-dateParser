# Angular DateParser

A simple parser that converts date and time strings into JavaScript Date objects.

## Prerequisites

1. Angular 1.0.1+

## Usage

Include the parser directive file, and attach it to an input field.

    <input type="text" ng-model="date" date-parser="dd.MM.yyyy HH:mm" />

## Parameters

### ngModel (Date)

This is the model that the element is bound to. The parser will update this model when the input field value is changed.

This is REQUIRED.

<sub>Added: 1.0.0</sub>

### dateParser (string)

This is the directive that initialises the parser. The value in this parameter is the format that will be used when parsing.

This is REQUIRED.

<sub>Added: 1.0.0</sub>

## Date formats

All Date formats specified in the Date filter documentation can be used, as well as custom formats.

## Localisation

This parser depends on the $locale service to provide it with the list of formats, as well as names of months and days. To use this feature, include the locale file included in the Angular bundle.
