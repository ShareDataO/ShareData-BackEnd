const GraphQLSchema = require('graphql').GraphQLSchema;
const {
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLObjectType
} = require('graphql');

function _getDataGraphQlType(data) {
  switch (typeof data) {
    case 'number':
      return GraphQLInt;
    case 'string':
      return GraphQLString;
    case 'object':
      return Array.isArray(data) ? GraphQLList : GraphQLObjectType;
    case 'boolean':
      return GraphQLBoolean;
    default:
      break;
  }
}


function _generateType(datas) {
  const result = {};
  const keys = Object.keys(datas[0]);
  keys.forEach((key) => {
    result[key] = {
      type: _getDataGraphQlType(datas[0][key])
    };
  });
  return new GraphQLObjectType({
    name: 'dynamic',
    fields: result
  });
}

function _generateDyanmicScheam(datas) {

  const result = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'root',
      fields: {
        datas: {
          type: new GraphQLList(_generateType(datas)),
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
