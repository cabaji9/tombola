
    angular.module('app').service("AppService",
        ['$http', '$sce', 'config', 'responseService','$location', function ($http, $sce, configService, ResponseService ,$location) {
            var context = configService.backendUrl;

            this.getData = function () {
                var url = context+"/data";
                return $http.get(url).then(
                    function (response) {
                        var responseVar = response.data;
                        return responseVar;
                    }, ResponseService.error);
            }
        }]);

