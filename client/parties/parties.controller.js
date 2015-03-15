angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor', '$rootScope',
  function($scope, $meteor, $rootScope){

    $scope.page = 1;
$scope.perPage = 3;
$scope.sort = { name: 1 };

$scope.orderProperty = '1';

    $scope.parties = $meteor.collection(function() {
  return Parties.find({}, {
    sort : $scope.getReactively('sort')
  });
});

    $scope.$watch('orderProperty', function(){
  if ($scope.orderProperty)
    $scope.sort = {name: parseInt($scope.orderProperty)};
});

    $scope.pageChanged = function(newPage) {
  $scope.page = newPage;
};

$meteor.autorun($scope, function() {

  $meteor.subscribe('parties', {
  limit: parseInt($scope.getReactively('perPage')),
  skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
  sort: $scope.getReactively('sort')
}, $scope.getReactively('search')).then(function(){
    $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);
  });

});
    
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

    var subscriptionHandle;

$meteor.subscribe('parties').then(function(handle) {
  subscriptionHandle = handle;
});

$scope.$on('$destroy', function() {
  subscriptionHandle.stop();
});


    
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