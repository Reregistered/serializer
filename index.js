///////////////////////////////////////////////////
// created by: Dov Amihod
// Date : March 12th 2013
// purpose: This class is intended to provide a serial processing
// task queue

function Serializer(params){
  params = params || {};

  this.jobs     = [];
  this.watchdog = params.watchdog;
  this.watchdogTimeout = params.watchdogTimeout || 15000;
  this.logger      = params.logger || function(){};
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
 * Get the current length of the job queue. Useful for debugging.
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
      that.watchdogStart(job);
      job.params.push(function(err,res){
        that.watchdogEnd(job);
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

Serializer.prototype.watchdogStart = function(jobInfo){
  if (this.watchdog){
    var that = this;
    jobInfo.watchdogTimer = setTimeout(function(){
      that.logger('*************** WARNING ***************');
      that.logger('*************** WARNING ***************');
      that.logger('**');
      that.logger('**         Watchdog exceeded');
      that.logger('**   job params - ' + JSON.stringify(jobInfo.params));
      that.logger('**************************************');
      // and try to keep running
      jobInfo.params[jobInfo.params.length-1]('Job timeout',null);
    }, that.watchdogTimeout);
  }
};

Serializer.prototype.watchdogEnd = function(jobInfo){
  if (jobInfo.watchdogTimer){
    clearTimeout(jobInfo.watchdogTimer);
    jobInfo.watchdogTimer = 0;
  }
};

exports = module.exports = Serializer;
