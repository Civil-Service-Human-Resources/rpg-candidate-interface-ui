#CSHR API

## Prerequisites

* Docker ^17.05
* Docker Compose

## Setup

* Clone this repository 
* Run `make` or `./bin/build.sh` - this will setup `.env` file, create docker bridge network and build docker images with all npm dependencies 

## Running the app

`make run` or `docker-compose up app`

## Stopping the app

`make stop` or `docker-compose stop app`

## Running Tests
`make test` or `docker-compose run --rm app npm run test`
