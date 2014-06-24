module.exports = function ( grunt ) {
  
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
      continuous: {
        singleRun: true
      }
    },

    uglify: {
      development: {
        options: {
          beautify: true,
          sourceMap: false,
          mangle: false,
          compress: false,
          preserveComments: 'some'
        },
        files: {
          'dist/angular-dateparser.js': ['dateparser.js']
        }
      },
      production: {
        options: {
          sourceMap: true,
          mangle: true,
          compress: {
            drop_console: true
          },
          preserveComments: 'some'
        },
        files: {
          'dist/angular-dateparser.min.js': ['dateparser.js']
        }
      }
    },

    clean: ['dist']
  };

  grunt.initConfig(taskConfig);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['karma:continuous']);
  grunt.registerTask('build', ['karma:continuous', 'clean', 'uglify']);
};
