///////////////////////////////////////////////////
// created by: Dov Amihod
// Date : March 12th 2013
// purpose: This class is intended to provide a serial processing along the lines of
// a common 'key'. Jpbs are processed in parallel unless there is a currently executing
// job with the same key.

var path = require('path'),
  Pool = require(path.join(__dirname, 'Pool.js')),
  Serializer = require(path.join(__dirname,'Serializer'));


function KeyedSerializer(params){
  params = params || {};

  this.queues = {};

  // create our pool of serializers
  this.pool = new Pool(function(){
    return new Serializer(params)
  }, 3)
}

/**
 * Used to add a job/function to a specific queue
 * @param in_key {string}
 * @param in_func  - function to execute - function should be of the signature
 *  func(param1, param2, ... , callback)
 * @param in_paramArray - function params [ excluding the callback]
 * @param cb         - callback when the job is executed. callback is of the form
 *  callback (error, result)
 */
KeyedSerializer.prototype.add = function(in_key, in_func, in_paramArray, cb){

  var that = this;
  // check if we have a serializer for this already
  var queue = this.queues[in_key];
  if (!queue){
    queue = this.pool.getItem();
    this.queues[in_key] = queue;
  }

  // overload the callback
  var localCb = function(err, res) {

    // The job is not removed from the queue until after the callback
    // if there's one job in the queue, its me.
    if (queue.length() === 1) {
      // remove and return it;
      that.pool.returnItem(queue);
      delete that.queues[in_key];
    }
    cb(err,res);
  };

  queue.add(in_func, in_paramArray, localCb);

};


exports = module.exports = KeyedSerializer;
