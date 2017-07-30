/**
 * 計算物件的Bytes大小
 *
 * @param object - handles object/string/boolean/buffer
 * @returns Number
 */

function sizeof(object) {

  if (object !== null && typeof (object) === 'object') {
    if (Buffer.isBuffer(object)) {
      return object.length;
    }
    let bytes = 0;

    for (const key in object) {

      if (!Object.hasOwnProperty.call(object, key)) {
        continue;
      }

      bytes += sizeof(key);

      try {
        bytes += sizeof(object[key]);
      } catch (e) {
        if (e instanceof RangeError) {
          bytes = 0;
        }
      }
    }
    return bytes;

  } else if (typeof (object) === 'string') {
    return object.length * 2;
  } else if (typeof (object) === 'boolean') {
    return 4;
  } else if (typeof (object) === 'number') {
    return 8;
  }
  return 0;

}

module.exports = sizeof;
