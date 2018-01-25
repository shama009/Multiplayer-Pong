var express = require('express');
var router = express.Router();

// const Score = require('../models/score_2p');

const { Score_2P } = require('../models');


// router.get('/scoreboard', (req, res) => {
//   console.log("Testing");
//   Score_2P
//     .findAll({
//       order: [[ 'createdAt', 'DESC' ]]
//     })
//     .then(scores => {
//       res.render('index', {scores: scores});
//     });
//   res.render('index');
// })

// GET route for getting all of the posts
router.get("/api/scores", function(req, res) {
  Score_2P.findAll({}).then(scores => { // {order: ...}
    res.json(scores); // json or render?
  });
});


// router.get("/teams", function (req, res) {
//   db.Team.findAll({}).then(function (data) {
//       // res.json(data);
//       var teams = {
//           teams: data
//       };
//       res.render("index", teams);
//   });
// });












// router.post('/', (req, res) => {
//   const player1 = req.body.player1
//   const player2 = req.body.player2
//   const score1 = req.body.score1
//   const score2 = req.body.score2
//
//   Score_2P.findAll({
//     where:
//       {$or:
//         [{ player1: {$eq: req.body.player1}, player2: {$eq: req.body.player2}},
//         { player1: {$eq: req.body.player2}, player2: {$eq: req.body.player1}}]
//       }
//   }).then((result) => {
//     if (result[0] == undefined) {
//       Score_2P.create({
//         player1: player1,
//         player2: player2,
//         player1_score: score1,
//         player2_score: score2
//         })
//       } else {
//         // result[1].dataValues.id
//       }
//     }).then(() => {
//       res.redirect('/');
//   }).catch((error) => {
//     console.log(error)
//   })
// })

//   Score_2P.create({
//     player1: player1,
//     player2: player2,
//     player1_score: score1,
//     player2_score: score2
//   }).then((score) => {
//     // res.render('index');
//     res.redirect('/');
//   }).catch((error) => {
//     console.log(error)
//   })
// })

// router.post('/', (req, res) => {
//   const player1 = req.body.player1
//   const player2 = req.body.player2
//   const score1 = req.body.score1
//   const score2 = req.body.score2
//
//   Score_2P.create({
//     player1: player1,
//     player2: player2,
//     player1_score: score1,
//     player2_score: score2
//   }).then((score) => {
//     // res.render('index');
//     res.redirect('/');
//   }).catch((error) => {
//     console.log(error)
//   })
// })

module.exports = router;
