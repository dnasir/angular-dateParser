module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-karma');

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        runnerPort: 9101,
        background: true
      },
      single: {
        singleRun: true
      }
    },

    uglify: {
      raw: {
        options: {
          beautify: true,
          sourceMap: false,
          mangle: false,
          compress: false,
          preserveComments: 'some',
          banner: ['/*!', ' * <%= pkg.name %> <%= pkg.version %>', ' * <%= pkg.homepage %>', ' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author %>', ' * Licensed under: <%= pkg.licenses.type %> (<%= pkg.licenses.url %>)\n */\n\n'].join('\n'),
          enclose: {
            angular: 'angular'
          }
        },
        files: {
          'dist/angular-dateparser.js': ['dateparser.js', 'dateparser.directive.js']
        }
      },
      prod: {
        options: {
          sourceMap: true,
          mangle: true,
          compress: {
            drop_console: true
          },
          preserveComments: false,
          banner: '/*! <%= pkg.name %> <%= pkg.version %> | ' +
            '(c) <%= grunt.template.today("yyyy") %>, <%= pkg.author %> | ' +
            '<%= pkg.licenses.type %> (<%= pkg.licenses.url %>) */'
        },
        files: {
          'dist/angular-dateparser.min.js': ['dist/angular-dateparser.js']
        }
      }
    },

    clean: ['dist']
  };

  grunt.initConfig(taskConfig);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['karma:single']);
  grunt.registerTask('build', [ 'karma:single', 'clean', 'uglify']);
};