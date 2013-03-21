///////////////////////////////////////////////////
// created by: Dov Amihod
// Date : March 12th 2013
// purpose: This class is intended to provide a serial processing
// task queue

function Serializer(){
  this.jobs       = [];
}

/**
 * Used to add a job/function to the queue
 * @param func  - function to execute - function should be of the signature
 *  func(param1, param2, ... , callback)
 * @param paramArray - function params [ excluding the callback]
 * @param cb         - callback when the job is executed. callback is of the form
 *  callback (error, result)
 */
Serializer.prototype.add = function(func, paramArray, cb){
  cb = cb || function(){};
  var length = this.jobs.push({func:func, params:paramArray, callback:cb});
  if (length === 1){
    process.nextTick(this.process());
  }
};


/**
 * Get the current length of the job queue. Usefull for debugging.
 * @return {Number}
 */
Serializer.prototype.length = function(){
  return this.jobs.length();
};

/**
 * Internal function : called to execute the jobs.
 * @return {Function}
 */
Serializer.prototype.process = function(){
  var that = this;
  return function(){
    var jobsLength = that.jobs.length;
    if (jobsLength) {
      var job = that.jobs[0];
      job.params.push(function(err,res){
        job.callback(err,res);
        that.jobs.shift();
        jobsLength = that.jobs.length;
        if (jobsLength >= 1){
          process.nextTick(that.process.call(that));
        }
      });
      job.func.apply(null,job.params);
    }
  }
};

exports = module.exports = Serializer;
