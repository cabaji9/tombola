(function () {
    'use strict';

    angular.module('app')
        .run(['$rootScope', '$location', 'ngAnalyticsService', function ($rootScope, $location, ngAnalyticsService) {
            //  ngAnalyticsService.setClientId('1026831050935-psnl76nl32ddo0bh7cs8e4uh8otiojf8.apps.googleusercontent.com');
        }]);

    angular.module('app').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ]);


    angular.module('app')
        .config(function ($routeProvider) {
            $routeProvider
                .when('/tombola', {
                    templateUrl: 'app/tombola/main.html',
                })
                .otherwise({
                    redirectTo: '/tombola'
                });

        });

})();
