module.exports = function ( grunt ) {
  
  grunt.loadNpmTasks('grunt-karma');

  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),

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
  };

  grunt.initConfig(taskConfig);

  grunt.registerTask( 'default', [ 'karma:continuous' ] );
};
