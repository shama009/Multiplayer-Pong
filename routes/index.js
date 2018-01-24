var express = require('express');
var router = express.Router();

// const Score = require('../models/score_2p');

const { Score_2P } = require('../models');


// router.get('/', (req, res) => {
  // console.log("Hi ._.");
  // Score_2P
  //   .findAll({
  //     order: [[ 'createdAt', 'DESC' ]]
  //   })
  //   .then(scores => {
      // res.render('index', {scores: scores});
    // });
//   res.render('index');
// })

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
