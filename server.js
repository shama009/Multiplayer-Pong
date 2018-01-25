function myLogger(string) {
   console.log(string);
}

// Import dependencies
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var Sequelize = require('sequelize');
var db = require('./models/index.js');

var {Score_2P} = require('./models');

// Set default route to view index file
app.get('/', function(req, res) {
  res.render(__dirname + '/views/index.ejs');
});

db.sequelize.sync().then(function() {

});// Listen on a dynamically assigned port or port 3000 (depending on environment)
server.listen(process.env.PORT || 3000);

////////////SOCKET LOGIC//////////////////

var playerList = [];

var Player = function(id, side) {
  var self = {
    id: id,
    side: side
  };

  return self;
};

var paddleSide = ["left", "right"];
var socketID = [1, 2];
var counter = 0;
var roomCounter = 1;

// Socket connection event
io.on('connection', function(socket) {
  socket.on('gameStart', function(data) {
    myLogger("gameStart " + JSON.stringify(data));

    // Only allow 2 players
    if (counter == 0) {
      myLogger("adding player 1")

      //  socket.id = socketID.shift();
      var playerId = socketID.shift();

      var player = Player(playerId);
      player.side = paddleSide.shift();
      player.room = 'room' + roomCounter
      playerList.push(player);

      socket.join('room' + roomCounter);

      myLogger(player);

      socket.emit('join', player.side);

      counter++;

      myLogger("room is called: " + player.room)
      myLogger("counter is: " + counter)

    } else if (counter == 1) {
      myLogger("adding player 2")
      // Disconnect client
      // socket.disconnect();
      var playerId = socketID.shift();

      var player = Player(playerId);
      player.side = paddleSide.shift();
      player.room = 'room' + roomCounter;
      playerList.push(player);

      socket.join('room' + roomCounter);

      myLogger(player);

      socket.emit('join', player.side);

      counter = 0;
      roomCounter++;
      paddleSide = ["left", "right"];
      socketID = [1, 2];

      myLogger(counter);

    }

    socket.on('updatePlayer', function(data) {
      // myLogger("updatePlayer " + JSON.stringify(data));

      var pack = [];

      pack.push({side: player.side, id: data});

      if (playerList.length % 2 == 0) {
        io.to(player.room).emit('receivePlayer', pack);
      }
    });

    socket.on('updatePlayerName', function(data) {
      // myLogger('updatePlayerName: ' + data)
      socket.broadcast.to(player.room).emit('receivePlayerName', data);
    });

    socket.on('updatePaddlePosition', function(data) {
      // myLogger("updatePaddlePosition: " + JSON.stringify(data));
      socket.broadcast.to(player.room).emit('receivePaddlePosition', data);
    });

    socket.on('updateBallPosition', function(data) {
      // myLogger("updateBallPosition: " + JSON.stringify(data));
      socket.broadcast.to(player.room).emit('receiveBallPosition', data);
    });

    socket.on('updateCollideWithPaddle', function(data) {
      myLogger("updateCollideWithPaddle: " + JSON.stringify(data));

      socket.broadcast.to(player.room).emit('receiveCollideWithPaddle', data);
    });

    socket.on('updateScores', function(data) {
      myLogger("updateScores: " + JSON.stringify(data));
      io.to(player.room).emit('receiveScores', data);
    })

    socket.on('updateBallLaunchPosition', function(data) {
      myLogger("1_updateBallLaunchPosition: side: " + player.side + " and data: " + JSON.stringify(data));

      if (data[0].missedSide == player.side || data[0].missedSide == undefined) {
        myLogger("missed side:" + data[0].missedSide + "player side: " + player.side);
        io.to(player.room).emit('receiveBallLaunchPosition', data);
        myLogger("2_updateBallLaunchPosition: side: " + player.side + " and data: " + JSON.stringify(data));
      }
    });

    socket.on('updateScoreData', function(data) {
      myLogger("updateScoreData: " + JSON.stringify(data));

      if (data[0].scoreRight > data[0].scoreLeft) {
        data[0].scoreRight = 1
        data[0].scoreLeft = 0
      } else {
        data[0].scoreRight = 0
        data[0].scoreLeft = 1
      }

      result = Score_2P.findAll({
        where: {
          $or: [
            {
              player1: {
                $eq: data[0].playerNameLeft
              },
              player2: {
                $eq: data[0].playerNameRight
              }
            }, {
              player1: {
                $eq: data[0].playerNameRight
              },
              player2: {
                $eq: data[0].playerNameLeft
              }
            }
          ]
        }
      }).then((result) => {
        if (result[0] == undefined) {
          Score_2P.create({
            player1: data[0].playerNameLeft,
            player2: data[0].playerNameRight,
            player1_score: data[0].scoreLeft,
            player2_score: data[0].scoreRight
          })
        } else if (result[0].dataValues.player1 == data[0].playerNameLeft) {
          Score_2P.update({
            player1_score: result[0].dataValues.player1_score + data[0].scoreLeft,
            player2_score: result[0].dataValues.player2_score + data[0].scoreRight
          }, {
            where: {
              player1: data[0].playerNameLeft
            }
          });
        } else if (result[0].dataValues.player1 == data[0].playerNameRight) {
          Score_2P.update({
            player1_score: result[0].dataValues.player1_score + data[0].scoreRight,
            player2_score: result[0].dataValues.player2_score + data[0].scoreLeft
          }, {
            where: {
              player1: data[0].playerNameRight
            }
          });
        }
      }).then(result => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      })
      io.to(player.room).emit('receiveScoreData', data);
    });

    socket.on('updateMatchRecord', function(data) {
      myLogger('updateMatchRecord: ' + JSON.stringify(data))
      Score_2P.findAll({
        where: {
          $or: [
            {
              player1: {
                $eq: data[0].playerNameLeft
              },
              player2: {
                $eq: data[0].playerNameRight
              }
            }, {
              player1: {
                $eq: data[0].playerNameRight
              },
              player2: {
                $eq: data[0].playerNameLeft
              }
            }
          ]
        }
      }).then(result => {
        data.push({player1: result[0].dataValues.player1, player2: result[0].dataValues.player2, player1_score: result[0].dataValues.player1_score, player2_score: result[0].dataValues.player2_score});
        io.to(player.room).emit('receiveMatchRecord', data);
      }).catch((error) => {
        console.log(error)
      })
    });

    socket.on('updateGodPaddle', function(data) {
      socket.broadcast.to(player.room).emit('receiveGodPaddle', data);
    })

    socket.on('updateDestroyGodPaddle', function(data) {
      socket.broadcast.to(player.room).emit('receiveDestroyGodPaddle', data);
    })

    socket.on('disconnect', function(data) {
      myLogger("disconnected");

      playerList = [];
      paddleSide = ["left", "right"];
      socketID = [1, 2];
      counter = 0;
      myLogger("counter is: " + counter)
    });
  });

});

//Middleware//

var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.static(path.join(public)));
app.use(express.static(__dirname));

// app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
