# RPG Candidate Interface UI

## Prerequisites

* Node v9+

## Running the app

* Clone this repo
* Copy `.env.sample` to `.env` and complete variables for your services
* Run `npm start`

You can now access this app from the browser: [http://localhost:3000](http://localhost:3000)

## Stopping the app
Hit `cmd + c`

## Running in dev with watchers
Run `npm run dev`

## Running Tests
Run `npm run test`


## Manual deploy to Government PaaS

### Prerequisites

1. Install the CloudFoundry CLI tool
2. Login to the Government PaaS instance and space you wish to deploy to.

### How to deploy

*Note* This deployment method uses your local `.env` file to populate environment
variables on CloudFoundry. You __must__ ensure that you have the correct set of
variables for the correct environment set in that file.

To push to the staging environment run: `make deploy-staging`

This will push to the application `rpg-ci`, making use of the local staging
cf manifest (`manifest.staging.yml`) and set a bunch of environment variables
currently set in your local `.env` file.
