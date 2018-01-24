var socket = io();

socket.on('join', function(data) {
  myLogger("join:  " + JSON.stringify(data));
  game.state.states['main']._playerSide = data;
  properties.playerSide = game.state.states['main']._playerSide
});

socket.on('receivePlayer', function(data) {
  myLogger("receivePlayer " + JSON.stringify(data));
  MainStateInstance.receivePlayer(data);
});

socket.on('receivePlayerName', function(data) {
  MainStateInstance.receivePlayerName(data);
})

socket.on('receivePaddlePosition', function(data) {
  // myLogger("receivePaddlePosition: " + JSON.stringify(data));
  MainStateInstance.receivePaddlePosition(data);
});

socket.on('receiveBallPosition', function(data) {
  // myLogger("receiveBallPosition: " + JSON.stringify(data));
  MainStateInstance.receiveBallPosition(data);
});

socket.on('receiveCollideWithPaddle', function(data) {
  myLogger("receiveCollideWithPaddle: " + JSON.stringify(data));
  MainStateInstance.receiveCollideWithPaddle(data);
});

socket.on('receiveScores', function(data) {
  myLogger("receiveScores: " + JSON.stringify(data));
  MainStateInstance.receiveScores(data);
});

socket.on('receiveBallLaunchPosition', function(data) {
  myLogger("receiveBallLaunchPosition: " + JSON.stringify(data));
  MainStateInstance.receiveBallLaunchPosition(data);
});

socket.on('receiveScoreData', function(data) {
  MainStateInstance.receiveScoreData(data);
});

socket.on('receiveMatchRecord', function(data) {
  MainStateInstance.receiveMatchRecord(data);
});

socket.on('receiveGodPaddle', function(data) {
  MainStateInstance.receiveGodPaddle(data);
});

socket.on('receiveDestroyGodPaddle', function(data) {
  MainStateInstance.receiveDestroyGodPaddle(data);
});
