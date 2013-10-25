serializer
==========

Used to serialize the execution of functions
Now exposes Keyed serializer which allows you to serialize execution based on common keys.

Example usage
=============

serializer  = require('./serializer')

...
...

var processQueue = new serializer();

function SomeClass(){
}

SomeClass.prototype.someFunc = function(param1, param2, callback){
}

var inst = new SomeClass();

processQueue.add(inst,inst.someFunc,[1,2], function(err,result){
  console.log(job finished);
});
