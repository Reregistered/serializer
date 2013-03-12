///////////////////////////////////////////////////
// created by: Dov Amihod
// Date : Dec 17th 2012
// purpose: This class is intended to provide a serial processing
// task queue

function Serializer(){
  this.jobs       = [];
  this.processing = false;
}

// init the object with the connection and the hash name
Serializer.prototype.add = function(scope, func, paramArray, cb){
  cb = cb || function(){};
  var length = this.jobs.push({scope:scope,func:func, params:paramArray, callback:cb});
  if (length === 1){
    process.nextTick(this.process());
  }
  console.log('serializer : ');
  console.log('    length : ' + length);
};

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
      job.func.apply(job.scope,job.params);
    }
  }
};

exports = module.exports = Serializer;
