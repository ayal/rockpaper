var Games = new Meteor.Collection("games");

if (Meteor.isClient) {
  Template.lobby.games = function(){
    return Games.find();
  };

  Template.lobby.events({
    'click .newgame': function(){
      if (Meteor.user()) {
        var gameId = Games.insert({playerOne: {name: Meteor.user().profile.name}});
      } else {
        alert('please log in first');
      }
    },
    'click .sithere': function(){
      if (Meteor.user()) {
        var theGame = Games.findOne({_id: this._id});
        if (theGame.playerOne.name === Meteor.user().profile.name) { // xcxc
          alert("You can't play against yourself");
        } else {
          Games.update(this._id, {$set: {playerTwo: {name: Meteor.user().profile.name}}});
        }
      } else {
        alert('please log in first');
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

