var Games = new Meteor.Collection("games");

Meteor.methods({
  play: function(gameId, move) {
    var game = Games.findOne(gameId);

    if (game.playerOneName === Meteor.user().profile.name) {
      Games.update(gameId, {$set: {"playerOneMove": move, playerOnePlayed: true}});
    } else if (game.playerTwoName === Meteor.user().profile.name) {
      Games.update(gameId, {$set: {"playerTwoMove": move, playerTwoPlayed: true}});
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
        var gameId = Games.insert({playerOneName: Meteor.user().profile.name});
      } else {
        alert('please log in first');
      }
    },
    'click .sithere': function(){
      if (Meteor.user()) {
        Games.update(this._id, {$set: {playerTwoName: Meteor.user().profile.name}});
      } else {
        alert('please log in first');
      }
    }
  });

  Template.game.canPlay = function () {
    if (!Meteor.user() || !Meteor.user().profile)
      return false;

    if (this.playerOneName === Meteor.user().profile.name) {
      return !this.playerOnePlayed;
    } else if (this.playerTwoName === Meteor.user().profile.name) {
      return !this.playerTwoPlayed;
    } else {
      return false;
    }
  };

  Template.game.possibleMoves = [{move: 'rock'}, {move: 'paper'}, {move: 'scissors'}];
  Template.game.events({
    'click .move': function (event, template) {
      Meteor.call("play", template.data._id, this.move);
    }
  });

  Template.game.canJoin = function () {
    return Meteor.user() && Meteor.user().profile && this.playerOneName !== Meteor.user().profile.name;
  };

  Template.game.gameOver = function () {
    return this.playerOneMove && this.playerTwoMove;
  };

  Template.game.winner = function () {
    var winners = {
      rock: {paper: "playerTwo", scissors: "playerOne"},
      paper: {rock: "playerOne", scissors: "playerTwo"},
      scissors: {rock: "playerTwo", paper: "playerOne"}
    };

    var winner = winners[this.playerOneMove][this.playerTwoMove];
    if (!winner)
      return "TIE";
    else
      return this[winner + "Name"];
  };

  Template.scores.high = function() {
    var arr = Games.find({}).fetch();
    high = !arr.length ? {} : arr.map(function(x){return x.playerOneMove && x.playerTwoMove && Template.game.winner.apply(x, []) }).reduce(function(a,b){console.log(a,b); var memo = a; if (typeof memo !== 'object'){ memo = {}; memo[a] ? memo[a]++ : memo[a] = 1; } memo[b] ? memo[b]++ : memo[b] = 1;  return memo;});
    return _.keys(high);

  };

  Template.scores.score = function(who){
    return high[who];
  };
}

if (Meteor.isServer) {
  Meteor.publish(null, function () {
    return Games.find({}, {fields: {
      "playerOneName": 1,
      "playerTwoName": 1,
      "playerOnePlayed": 1,
      "playerTwoPlayed": 1
    }});
  });
  Meteor.publish(null, function () {
    return Games.find({"playerOneMove": {$exists: true}, "playerTwoMove": {$exists: true}});
  });
}

