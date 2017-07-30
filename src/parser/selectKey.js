const defaultKeyName = '_id_';

function createKeyAndData(datas) {
  let  count = 0;

  const newKeyName = defaultKeyName;
  datas.forEach((data, index) => {
    count++;
    data[newKeyName] = count;
  });
}

/**
 * This method can select array obj key
 * Ex. [{"a":1,"b":1},{"a":1,"b":2}] ===> select b is key
 * @param {array} datas , array objs
 * @returns {string} , return selected Key
 */
function selectKey(datas) {
  const length = datas.length;
  const keys = Object.keys(datas[0]);
  const keyLength = keys.length;
  let  result;
  let hash = {};

  for (let j = 0; j < keyLength; j++) {
    if (!(typeof datas[0][keys[j]] === 'number'))      { continue; }

    hash = {};
    for (let i = 0; i < length; i++) {
      if (hash[datas[i][keys[j]]] > 0)        { break; }

      hash[datas[i][keys[j]]] = 1;
      if (i === length - 1)        { result = keys[j]; }
    }
    if (result)      { break; }
  }

  if (!result) {
    result = defaultKeyName;
    createKeyAndData(datas);
  }
  return result;
}

module.exports = {
  selectKey
};
