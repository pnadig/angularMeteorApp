angular.module("socially").filter('uninvited', function () {
  return function (users, party) {
    if (!party)
      return false;

    return _.filter(users, function (user) {
      if (user._id == party.owner ||
          _.contains(party.invited, user._id))
        return false;
      else
        return true;
    });
  }
})
.filter('displayName', function () {
  return function (user) {
    if (!user)
      return;
    if (user.profile && user.profile.name)
      return user.profile.name;
    else if (user.emails)
      return user.emails[0].address;
    else
      return user;
  }
});