/*
 * Log4stuff.js: Transport for outputting to the Log4stuff
 *
 * (C) 2014 Jason Young
 * MIT LICENCE
 *
 */

var events = require('events'),
    util = require('util'),
    http = require('http'),
    os = require('os'),
    winston = require('winston');

//
// ### function Log4stuff (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Log4stuff transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var Log4stuff = exports.Log4stuff = function (options) {
  winston.Transport.call(this, options);
  options = options || {};

  this.applicationId = options.applicationId;

  if (this.json) {
    this.stringify = options.stringify || function (obj) {
      return JSON.stringify(obj, null, 2);
    };
  }
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Log4stuff, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
Log4stuff.prototype.name = 'Log4stuff';

winston.transports.Log4stuff = Log4stuff;

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
Log4stuff.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var self = this;

  meta = meta || {};
  meta["log4net:HostName"] = os.hostname();

  var now = new Date();
  //Todo: Make the date/times prettier
  var dateStr = now.getFullYear() + "-"
    + (1 + now.getMonth()) + "-"
    + now.getDate() + " "
    + now.getHours() + ":"
    + now.getMinutes() + ":"
    + now.getSeconds();

  var logEvent = {
    "Logger": "winston",
    "Thread": "",
    "Timestamp": dateStr,
    "Level": level,
    "Message": msg,
    "Metadata": meta,
  };

  var json = JSON.stringify(logEvent);
  var encoded = escape(json);

  //var url = "http://localhost:58227/app/" + this.applicationId + "?logEvent=" + encoded;
  var url = "http://log4stuff.com/app/" + this.applicationId + "?logEvent=" + encoded;

  //console.log(url);

  http.get(url, function(res) {
    if(res.statusCode == 200) {
      self.emit('logged');
      callback(null, true);  
    } else {
      //Remote server error
      self.emit('error', null);
      if (callback) callback(null, false);
      callback = null;
    }
  }).on('error', function(err) {
    //Local error
    self.emit('error', err);
    if (callback) callback(err, false);
    callback = null;
  });
};
