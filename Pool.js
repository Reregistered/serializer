/**
 * @fileoverview - very simple pooling class for arbitrary objects.
 */

/**
 *
 * @param in_fnElementCreate : Function which can be used to create more of what ever i'm pooling
 * @param in_defaultSize : default pool size
 * @constructor
 */
function Pool(in_fnElementCreate, in_defaultSize) {
  in_defaultSize = in_defaultSize || 3;

  this._size = 0;
  this.pool = [];

  // Over load the creation so we can track
  // the number of elements created.
  this.fnElementCreate = function () {
    this._size++;
    return in_fnElementCreate();
  };

  var itr = in_defaultSize;
  while (itr--) {
    this.pool.push(this.fnElementCreate());
  }
}

/**
 * Get an element from the pool
 * @returns {*}
 */
Pool.prototype.getItem = function () {

  var returnElement = this.pool.pop();
  if (!returnElement) {
    returnElement = this.fnElementCreate();
  }
  return returnElement;
};

/**
 * return an element to the pool
 * @param in_item
 */
Pool.prototype.returnItem = function (in_item) {
  this.pool.push(in_item);
};

/**
 * Size - for debugging.
 * @returns {number}
 */
Pool.prototype.size = function () {
  return this._size;
};

module.exports = Pool;