(function(){
  'use strict';

	var app = angular.module('app',[
	                                   'ngRoute',
	                                   'ui.bootstrap',
	                                   'ngSanitize',
	                                   'ngAnalytics'
	                                   ]);

	fetchConfiguration().then(bootstrapApplication);

	function fetchConfiguration() {
	    var initInjector = angular.injector(['ng']);
	    var $http = initInjector.get('$http');
	    var configFile = 'tombola.config.json?v2';
	    var apiBase = '/api/';

	    return $http.get(configFile).then(function(response) {
	      var configData = response.data;
	      configData.adminContext = configData.backendBaseContext + apiBase;
            app.constant('config', configData);
	    }, function(errorResponse) {
	      var defaultBackend = 'http://localhost:8080/smart-backend';
            app.constant('config', {
	        'backendBaseContext': defaultBackend,
	        'adminContext': defaultBackend + apiBase
	      });
	    });
	}

	function bootstrapApplication() {
	    angular.element(document).ready(function() {
	        angular.bootstrap(document, ['app']);
	    });
	}

})();
