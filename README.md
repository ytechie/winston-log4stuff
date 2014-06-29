winston-log4stuff
=================

A Winston transport that logs to [Log4Stuff](http://log4stuff.com), the real-time log display

## Usage

	var winston = require('winston');
  
	require('winston-log4stuff').Redis;
  
	winston.add(winston.transports.Log4stuff, { ApplicationId = 'winston_example' });

	logger.log('info', 'This is a log message from Winston!');

## Installation

Use the [node package manager (npm)](https://www.npmjs.org/) to install.

	npm install winston	
	npm install winston-log4stuff

## Example

First, open [http://log4stuff.com/app/winston_example](http://log4stuff.com/app/winston_example)

	var winston = require('winston');
	require('winston-log4stuff').Log4stuff;
	
	var logger = new (winston.Logger)({
	  transports: [
	    new (winston.transports.Log4stuff)({applicationId: "winston_example"})
	  ]
	});
	
	logger.log('info', 'Hello, this is a raw logging event',   { 'foo': 'bar' });
	logger.log('info', 'Hello, this is a raw logging event 2', { 'foo': 'bar' });

Run the example script, and you'll see the log messages appear on the Log4net website in real-time.