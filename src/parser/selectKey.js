const defaultKeyName = "_id_";
/**
 * This method can select array obj key 
 * Ex. [{"a":1,"b":1},{"a":1,"b":2}] ===> select b is key
 * @param {array} datas , array objs 
 * @returns {string} , return selected Key 
 */
function selectKey(datas) {
  var hash = {},
    length = datas.length,
    keys = Object.keys(datas[0]),
    keyLength = keys.length,
    result;

  for (var j = 0; j < keyLength; j++) {
    if (!(typeof datas[0][keys[j]] === "number"))
      continue;

    hash = {};
    for (var i = 0; i < length; i++) {
      if (hash[datas[i][keys[j]]] > 0)
        break;

      hash[datas[i][keys[j]]] = 1;
      if (i === length - 1)
        result = keys[j];
    }
    if (result)
      break;
  }

	if(!result){
		result = defaultKeyName;	
		createKeyAndData(datas);
	}
  return result;
}

function createKeyAndData(datas) {
  var length = datas.length,
    keys = Object.keys(datas[0]),
    keyLength = keys.length,
    result,
		newKeyName,
		count = 0;

	var newKeyName = defaultKeyName;	
  datas.forEach(function(data, index) {
		count++;	
		data[newKeyName] = count;
  })
}

module.exports = {
  "selectKey": selectKey
};
