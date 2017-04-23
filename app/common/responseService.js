(function() {
  'use strict';

  angular.module('app').service("responseService",
           ResponseService);

  function ResponseService() {

    this.success = function(response) {
      return response.data;
    };

    this.error = function(error) {
      alert(error);
    };
  }

})();
