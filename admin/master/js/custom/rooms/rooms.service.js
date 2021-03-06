 
(function() {
    'use strict';

    angular
        .module('app.rooms')
        .service('RoomService', RoomService);

    RoomService.$inject = ['$http', '$rootScope', '$resource'];

    function RoomService($http, $rootScope, $resource) {

      return {

        getAll: function(page, count) {
          return $http.get($rootScope.app.baseUrl + 'tags/select/all');
        },

        getDeleted: function(page, count) {
          return $http.get($rootScope.app.baseUrl + 'tags/select/removed');
        },

        remove: function(id) {
          return $http.get($rootScope.app.baseUrl + 'tags/remove/' + id);
        },

        update: function(id, name, description) {
          return $http.get($rootScope.app.baseUrl + 'tags/update/' + id + '/' + name + '/' + description);          
        },

        unRemove: function(id) {
          return $http.get($rootScope.app.baseUrl + 'tags/unremove/' + id);
        }

      }

    }

})();
