angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor',
  function($scope, $meteor){

    $scope.parties = $meteor.collection(Parties);
    
    $scope.remove = function(party){
  $scope.parties.remove(party);
};
    
    $scope.removeAll = function(){
  $scope.parties.remove();
};

  }])
.controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams,$meteor){

    $scope.party = $meteor.object(Parties, $stateParams.partyId, false);
    
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