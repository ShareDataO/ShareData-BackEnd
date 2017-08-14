const GraphQLSchema = require('graphql').GraphQLSchema;
const {
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLObjectType
} = require('graphql');

function _getDataGraphQlType(data, key) {
  switch (typeof data) {
    case 'number':
      return GraphQLInt;
    case 'string':
      return GraphQLString;
    case 'boolean':
      return GraphQLBoolean;
    default:
      break;
  }

  if (Array.isArray(data)) {
    return new GraphQLList(_generateType((data[0])));  // eslint-disable-line
  } else if (typeof data === 'object') {
    return _generateType(data, key); // eslint-disable-line
  }
}


function _generateType(datas, typeName) {
  const result = {};
  let target;
  if (Array.isArray(datas)) {
    target = datas[0];
  } else {
    target = datas;
  }
  const keys = Object.keys(target);
  keys.forEach((key) => {
    result[key] = {
      type: _getDataGraphQlType(target[key], key)
    };
  });
  return new GraphQLObjectType({
    name: typeName,
    fields: result
  });
}

function _generateDyanmicScheam(datas) {

  const result = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'root',
      fields: {
        datas: {
          type: new GraphQLList(_generateType(datas, 'origin')),
          resolve: () => datas
        }
      }
    })
  });
  return result;
}

function getScheam(datas) {
  return _generateDyanmicScheam(datas);
}

module.exports = getScheam;
