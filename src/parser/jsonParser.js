const obj = require('./selectKey');
/**
 * parser is use parse input data to array json object
 *
 * @param datas , user want to parse datas
 * @returns {object} , { "status" : true/false, "msg" : "" , "datas" : [] }
 */
function parser(datas, key) {
  if (typeof datas !== 'object')    {
    return {
      status: false,
      msg: 'Input not array or object'
    };
  }

  let result = [];
  if (!Object.prototype.hasOwnProperty.call(datas, 'length')) {
    result.push(datas);
  } else {
    result = datas;
  }
  return {
    status: true,
    datas: result,
    key : '_id_'
  };
}

module.exports = {
  jsonParser: parser
};
