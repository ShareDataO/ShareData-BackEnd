const GraphQLJSON = require('./graphQl-json-type');
const GraphQLSchema = require('graphql').GraphQLSchema;
const {
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLObjectType
} = require('graphql');

function getScheam(datas) {
    return _generateDyanmicScheam(datas[0]);
}

function _generateDyanmicScheam(data) {
    let result = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'query',
            fields: (() => {
                return _generateField(data);
            })()
        })
    });
    return result;
}

function _generateField(data) {
    let result = {};
    const keys = Object.keys(data);
    keys.forEach((key) => {
        result[key] = {
            type: _getDataGraphQlType(data[key]),
            resolve: () => {
                return data[key];
            }
        }
    });
    return result;
}


function _getDataGraphQlType(data) {
    switch (typeof data) {
        case "number":
            return GraphQLInt;
            break;
        case "string":
            return GraphQLString;
            break;
        case "object":
            return Array.isArray(data) ? GraphQLList : GraphQLObjectType;
            break;
        case "boolean":
            return GraphQLBoolean;
    }
}


module.exports = getScheam;
