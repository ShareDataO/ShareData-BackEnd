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
    return _generateDyanmicScheam(datas);
}

function _generateDyanmicScheam(datas) {
    let result = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'root',
            fields: {
                datas: {
                    type: new GraphQLList(_generateType(datas)),
                    resolve: ()=>{
                        return datas;
                    }
                }
            }
        })
    });
    return result;
}

function _generateType(datas) {
    let result = {};
    const keys = Object.keys(datas[0]);
    keys.forEach((key) => {
        result[key] = {
            type: _getDataGraphQlType(datas[0][key]),
        }
    });
    return new GraphQLObjectType({
        name: 'dynamic',
        fields: result
    })
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
