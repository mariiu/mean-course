var app = angular.module('Vidzy', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-video', {
            templateUrl: 'partials/video-form.html',
            controller: 'AddVideoCtrl'
        })
        .when('/video/:id', {
       templateUrl: 'partials/video-form.html',
       controller: 'EditVideoCtrl'
        })
        .when('/video/video-delete/:id', {
            templateUrl: 'partials/video-delete.html',
            controller: 'DeleteVideoCtrl'
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'registerCtrl',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl:'partials/login.html',
            controller: 'loginCtrl',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


app.service('authentication', ['$http', '$window', function($http, $window) {
    var saveToken = function (token) {
        $window.localStorage['vidzy-token'] = token;
    };
    var getToken = function () {
        return $window.localStorage['vidzy-token'];
    };

    var isLoggedIn = function() {
         var token = getToken();
         if(token) {
             var payload = JSON.parse($window.atob(token.split('.')[1]));
             return payload.exp > Date.now() / 1000;
         } else {
             return false;
         }
    };
    var currentUser = function() {
         if(isLoggedIn()){
             var token = getToken();
             var payload = JSON.parse($window.atob(token.split('.')[1]));
             return {
                 email : payload.email,
                 name : payload.name
             };
         }
    };

    register = function(user) {
        console.log("WTF");
        return $http.post('/register', user).success(function(data) {
            saveToken(data.token);

        });
   };

   login = function(user) {
        return $http.post('/login', user).success(function(data) {
            saveToken(data.token);
        });
   };

   logout = function() {
       $window.localStorage.removeItem('vidzy-token');
   };

   return {
     currentUser : currentUser,
     saveToken : saveToken,
     getToken : getToken,
     isLoggedIn : isLoggedIn,
     register : register,
     login : login,
     logout : logout
   };

}]);

app.controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){
        var Videos = $resource('/api/videos');
       Videos.query(function(videos){
           $scope.videos = videos;
       });
    }]);

    app.controller('AddVideoCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Videos = $resource('/api/videos');
            Videos.save($scope.video, function(){
                $location.path('/');
            });
        };
    }]);

    app.controller('EditVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        });

        $scope.save = function(){
            Videos.update($scope.video, function(){
                $location.path('/');
            });
        }
    }]);
    app.controller('DeleteVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id');

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        });
        $scope.delete = function(){
            Videos.delete({ id: $routeParams.id }, function(video){
                $location.path('/');
            });
        };
    }]);

    app.controller('registerCtrl', ['$location', 'authentication', function($location, authentication) {
         var vm = this;
         vm.pageHeader = {
             title: 'Create a new Loc8r account'
         };
         vm.credentials = {
             name : "",
             email : "",
             password : ""
         };
         vm.returnPage = $location.search().page || '/';
         vm.onSubmit = function () {

            vm.formError = "";
              if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
                  vm.formError = "All fields required, please try again";
                  return false;
              } else {
                  vm.doRegister();
              }
             };
             vm.doRegister = function() {
              vm.formError = "";
              authentication
              .register(vm.credentials)
              .error(function(err){
                    vm.formError = err;
              })
              .then(function(){
                  $location.search('page', null);
                  $location.path(vm.returnPage);

              });
         };
 }]);

 app.controller('loginCtrl', ['$location', 'authentication', function($location, authentication) {
      var vm = this;
      vm.pageHeader = {
          title: 'Login'
      };
      vm.credentials = {
          email : "",
          password : ""
      };
      vm.returnPage = $location.search().page || '/';
      vm.onSubmit = function () {

         vm.formError = "";
           if (!vm.credentials.email || !vm.credentials.password) {
               vm.formError = "All fields required, please try again";
               return false;
           } else {
               vm.doLogin();
           }
          };
          vm.doLogin = function() {
           vm.formError = "";
           authentication
           .login(vm.credentials)
           .error(function(err){
                 vm.formError = err;
           })
           .then(function(){
               console.log(authentication.isLoggedIn());
               $location.search('page', null);
               $location.path(vm.returnPage);
           });
      };
}]);
