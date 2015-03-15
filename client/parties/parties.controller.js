angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor', '$rootScope',
  function($scope, $meteor, $rootScope){

    $scope.page = 1;
$scope.perPage = 3;
$scope.sort = { name: 1 };

$scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

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
  }, $scope.getReactively('search')).then(function() {
    $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);

    $scope.parties.forEach( function (party) {
      party.onClicked = function () {
        onMarkerClicked(party);
      };
    });

    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };

    var onMarkerClicked = function(marker){
      $state.go('partyDetails', {partyId: marker._id});
    }

  });
});
    
    $scope.remove = function(party){
  $scope.parties.remove(party);
};
    
    $scope.removeAll = function(){
  $scope.parties.remove();
};


$scope.getUserById = function(userId){
  return Meteor.users.findOne(userId);
};

$scope.creator = function(party){
  if (!party)
    return;
  var owner = $scope.getUserById(party.owner);
  if (!owner)
    return "nobody";

  if ($rootScope.currentUser)
    if ($rootScope.currentUser._id)
      if (owner._id === $rootScope.currentUser._id)
        return "me";

  return owner;
};

$scope.invite = function(user){
  $meteor.call('invite', $scope.party._id, user._id).then(
    function(data){
      console.log('success inviting', data);
    },
    function(err){
      console.log('failed', err);
    }
  );
};

$scope.rsvp = function(partyId, rsvp){
  $meteor.call('rsvp', partyId, rsvp).then(
    function(data){
      console.log('success responding', data);
    },
    function(err){
      console.log('failed', err);
    }
  );
};

$scope.outstandingInvitations = function (party) {

  return _.filter($scope.users, function (user) {
    return (_.contains(party.invited, user._id) &&
      !_.findWhere(party.rsvps, {user: user._id}));
  });
};

$scope.canInvite = function (){
  if (!$scope.party)
    return false;

  return !$scope.party.public &&
    $scope.party.owner === Meteor.userId();
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

$scope.canInvite = function (){
  if (!$scope.party)
    return false;

  return !$scope.party.public &&
    $scope.party.owner === Meteor.userId();
};

$scope.map = {
  center: {
    latitude: 45,
    longitude: -73
  },
  zoom: 8,
  events: {
    click: function (mapModel, eventName, originalEventArgs) {
      if (!$scope.party)
        return;

      if (!$scope.party.location)
        $scope.party.location = {};

      $scope.party.location.latitude = originalEventArgs[0].latLng.lat();
      $scope.party.location.longitude = originalEventArgs[0].latLng.lng();
      //scope apply required because this event handler is outside of the angular domain
      $scope.$apply();
    }
  },
  marker: {
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {
        if (!$scope.party.location)
          $scope.party.location = {};

        $scope.party.location.latitude = marker.getPosition().lat();
        $scope.party.location.longitude = marker.getPosition().lng();
      }
    }
  }
};


}]);