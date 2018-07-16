// Load the SDK for JavaScript
const AWS = require('aws-sdk');
const uuid = require('uuid');
const R = require('ramda');
var logger = require('../services/logger');

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION, 
    accessKeyId: process.env.AWS_KEY, 
    secretAccessKey: process.env.AWS_SECRET
  });

  const movieTable = process.env.AWS_MOVIE_TABLE;
  const movieTitleTable = process.env.AWS_MOVIE_TITLE_TABLE;
  
const getMovieList = () => {
    logger.log('info', "calling getMovieList() from controller", {tags: 'controller, dynamoDB'});    
    var params = {
        TableName: movieTable
       };

    return dynamoDB.scan(params).promise()
    .then(result => {
        logger.log('info', "getMovieList() from dynamoDB success", {tags: 'controller, dynamoDB'});
        return Promise.resolve(result);
       
    })
    .catch(error => {
        logger.log('error', "getMovieList() from dynamoDB failed " + error, {tags: 'controller, dynamoDB'});
        return Promise.reject(error);
    });
};

let getMovie = (req, res) => {
   
    logger.log('info', "calling getMovie() controller for id " + req.params.id, {tags: 'controller, dynamoDB'});
    var params = {
        TableName: movieTable,
        Key: {'id': req.params.id}
       };

    return dynamoDB.get(params).promise()
    .then(result => {   
        logger.log('info', "getMovie() from dynamoDB success", {tags: 'controller, dynamoDB'});         
        return Promise.resolve(result);  
    })
    .catch(error => {
        logger.log('error', "getMovie() from dynamoDB failed " + error, {tags: 'controller, dynamoDB'});
        return Promise.reject(error);
    });
};

let checkMovieTitleExists = (movie) => {

    var params = {
        TableName: movieTitleTable,
        Key: {'title': movie.title}
       };

    return dynamoDB.get(params).promise()
    .then(result => {
        if (R.not(R.isEmpty(result))) {           
            logger.log('info', "checkMovieTitleExists() from dynamoDB: This tite already exists - " + movie.title, {tags: 'dynamoDB'});
            return Promise.reject(new Error('movie already has this title - ' + movie.title));
        }  
        return movie;    
    })    
};

let checkString = (obj) => {
    for(let item in obj){
        //console.log(item + " " + obj[item]);
        if(obj[item] === '' || obj[item] === null || typeof obj[item] !== 'string'){
            return false
        }
    }   
    return true;
}

const insertMovieProcess = (req, res) => {
    logger.log('info', "calling insertMovieProcess() controller", {tags: 'controller, dynamoDB'});
    const requestBody = req.body;
    const title = requestBody.title;
    const studio = requestBody.studio;
    const releaseDate = requestBody.releaseDate;
    const director = requestBody.director;
    const genre = requestBody.genre;    

    if(checkString(requestBody) && title != null){
    //if (typeof title === 'string' && typeof studio === 'string' && typeof releaseDate === 'string' && typeof director === 'string' && typeof genre === 'string') {
        const movie = movieInfo(title, studio, releaseDate, director, genre);
        const movieInsertProcess = R.composeP(insertMovieTitle, insertMovie, checkMovieTitleExists);
    
        return movieInsertProcess(movie).then(result =>{
            logger.log('info', "calling insertMovieProcess() from dynamoDB success", {tags: 'controller, dynamoDB'});
            return Promise.resolve(requestBody);
            
        }).catch(error => {
            logger.log('error', "calling insertMovieProcess() from dynamoDB failed: " + error, {tags: 'controller, dynamoDB'});
            return Promise.reject(error);        
        });
    }else{
        logger.log('info', "calling insertMovieProcess() with validation error", {tags: 'controller, validation'});
        return Promise.reject('Validation Failed, can\'t insert movie.');  
    }
}


let insertMovie = (movie) => {
   
    var params = {
        TableName: movieTable,
        Item: movie
       };

    return dynamoDB.put(params).promise()
    .then(result => movie);
};

let insertMovieTitle = (movie) => {    
    var params = {
        TableName: movieTitleTable,
        Item: {
            id: movie.id,
            title: movie.title  
        }
       };

    return dynamoDB.put(params).promise();
};

const movieInfo = (title, studio, releaseDate, director, genre) => {
    const timestamp = new Date().getTime();
    return {
        id: uuid.v1(),
        title: title,
        studio: studio,
        releaseDate: releaseDate,
        director: director,
        genre: genre,      
        submittedAt: timestamp,
        updatedAt: timestamp,
    };
};

module.exports = {
    getMovieList: getMovieList,
    getMovie: getMovie,
    insertMovieProcess: insertMovieProcess
};