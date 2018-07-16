# movie-service

## Pre-installation
2 DynamoDB tables will be required.
- movie-list with id as primary key.
- movie-title-list with titel as primary key.

## Installation

```javascript
$ npm install
```

```.env

example .env below
----------------------------
AWS_REGION=us-east-1
AWS_KEY=xxxxxxxxxxxxxx
AWS_SECRET=xxxxxxxxxxxxxxxxxxxxxxx
AWS_MOVIE_TABLE=movie-list
AWS_MOVIE_TITLE_TABLE=movie-title-list
NODE_ENV=dev
LOG_LEVEL=info

```

## Trial

```shell
$ npm start
```

## Test
```shell
$ jest
```

## Logging
- logs can be viewed on cloudwatch under movie-log-group


## CURL Examples
``` insert movie

curl -X POST \
  http://192.168.99.1:8080/v1/movie \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 637f52a9-4cee-9237-0c70-3422aa07bfe9' \
  -d '{
	"title":"title10",
	"studio": "studio3", 
	"releaseDate":"12/12/1999",
	"director" : "director1",
	"genre" : "action"
}'

``` get all movies

curl -X GET \
  http://192.168.99.1:8080/v1/movie \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 49bd0d02-0d46-2675-0e6b-50e2f4164117'


``` get movie by id

curl -X GET \
  http://192.168.99.1:8080/v1/movie/id/2c5a06c0-8660-11e8-add4-65f41bd10619 \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: c6ffc9a1-4927-af76-f37b-f665179fd1fc'


