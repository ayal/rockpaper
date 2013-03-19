var Games = new Meteor.Collection("games");

Meteor.methods({
  play: function(gameId, move) {
    var game = Games.findOne(gameId);

    if (game.playerOne.name === Meteor.user().profile.name) {
      Games.update(gameId, {$set: {"playerOne.move": move}});
    } else if (game.playerTwo.name === Meteor.user().profile.name) {
      Games.update(gameId, {$set: {"playerTwo.move": move}});
    }
  }
});

if (Meteor.isClient) {
  Template.lobby.games = function() {
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
        Games.update(this._id, {$set: {playerTwo: {name: Meteor.user().profile.name}}});
      } else {
        alert('please log in first');
      }
    }
  });

  Template.game.canPlay = function () {
    if (this.playerOne.name === Meteor.user().profile.name) {
      return !this.playerOne.move;
    } else if (this.playerTwo.name === Meteor.user().profile.name) {
      return !this.playerTwo.move;
    } else {
      return false;
    }
  };

  Template.game.possibleMoves = [{name: 'rock'}, {name: 'paper'}, {name: 'scissors'}];
  Template.game.events({
    'click': function (event, template) {
      Meteor.call("play", template.data._id, this.name);
    }
  });

  Template.game.canJoin = function () {
    return this.playerOne.name !== Meteor.user().profile.name;
  };

  Template.game.gameOver = function () {
    return this.playerOne.move && this.playerTwo.move;
  };

  Template.game.winner = function () {
    var winners = {
      rock: {paper: "playerTwo", scissors: "playerOne"},
      paper: {rock: "playerOne", scissors: "playerTwo"},
      scissors: {rock: "playerTwo", paper: "playerOne"}
    };

    var winner = winners[this.playerOne.move][this.playerTwo.move];
    if (!winner)
      return "TIE";
    else
      return this[winner].name;
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

