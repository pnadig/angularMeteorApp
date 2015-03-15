angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor', '$rootScope',
  function($scope, $meteor, $rootScope){

    $scope.parties = $meteor.collection(Parties).subscribe('parties');
    
    $scope.remove = function(party){
  $scope.parties.remove(party);
};
    
    $scope.removeAll = function(){
  $scope.parties.remove();
};

  }])
.controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteor','$rootScope',
  function($scope, $stateParams,$meteor, $rootScope){

    $scope.party = $meteor.object(Parties, $stateParams.partyId).subscribe('parties');
    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    
    $scope.save = function() {
      $scope.party.save().then(function(numberOfDocs){
        console.log('save success doc affected ', numberOfDocs);
      }, function(error){
        console.log('save error', error);
      });
    };

$scope.reset = function() {
  $scope.party.reset();
};


}]);