var games = new Meteor.Collection("Games");


if (Meteor.isClient) {
  Template.lobby.games = function(){
    return games.find();
  };

  Template.lobby.events({
    'click .newgame': function(){
      console.log('new game');
      if (Meteor.user()) {
        var game_id = games.insert({player_one: {name: Meteor.user().profile.name}});        
      }
      else {
        alert('please log in first');
      }
    },
    'click .sithere': function(){
      if (Meteor.user()) {
        var thegame = games.findOne({_id: this._id});
        games.update(this._id, {$set: {player_two: {name: Meteor.user().profile.name}}});
      }
      else {
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
