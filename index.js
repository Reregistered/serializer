/**
 * @fileoverview: Entry point to expose the functionality of this module
 *
 */
var path = require('path');

var API = {
  Pool : require(path.join(__dirname, 'Pool.js')),
  Serializer : require(path.join(__dirname, 'Serializer.js')),
  KeyedSerializer : require(path.join(__dirname, 'KeyedSerializer.js'))
};

module.exports = API;