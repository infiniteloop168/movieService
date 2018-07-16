/**
 * @name movie-v1-api
 * @description This module packages the Movie API.
 */
'use strict';

const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = require('fwsp-server-response');

const movieController = require("../controllers/movie-v1-controller");
const logger = require('../services/logger');

let serverResponse = new ServerResponse();
express.response.sendError = function(err) {
  serverResponse.sendServerError(this, {result: {error: err}});
};
express.response.sendOk = function(result) {
  serverResponse.sendOk(this, {result});
};

let api = express.Router();

api.get('/', (req, res) => {

   movieController.getMovieList()
   .then(result => {
      logger.log('info', "api getMovieList() success", {tags: 'router, api'});
      res.json({status: "success", result:result});
   })
   .catch(err => {
      logger.log('error', "api getMovieList() failed", {tags: 'router, api'});
      res.sendStatus(400).json({status: "error", err});
      console.log("Error>>>: " + err);
   });
});

// example of using res.json to return a response
api.get('/id/:id', (req, res) => {
 
   movieController.getMovie(req, res)
   .then(result => {
      logger.log('info', "api getMovie() success", {tags: 'router, api'});
      res.json({status: "success", result:result});
   })
   .catch(err => {
      logger.log('error', "api getMovie() failed " + err, {tags: 'router, api'});
      res.json({status: "error", result:err});     
   });
});

api.get('/title/:title', (req, res) => {
 
  movieController.getMovieByTitle(req, res)
  .then(function(result) {
     res.json({status: "success", result:result});
  })
  .catch(function(err) {
     res.json({status: "error", result:err});
     console.log("Error>>: " + err);
  });
});

api.post('/', (req, res) => {
   console.log("post movie");
   movieController.insertMovieProcess(req, res)
   .then( result => {
      logger.log('info', "api insertMovieProcess() success", {tags: 'router, api'});
      res.json({status: "success", result:result});
   })
   .catch(err => {
      logger.log('info', "api insertMovieProcess() failed " + err, {tags: 'router, api'});
      res.json({status: "error", error : err.toString()});     
   });
});



module.exports = api;
