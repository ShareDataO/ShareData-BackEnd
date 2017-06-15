var sizeOf = require('../../lib/lib-sizeCal');
var validator = require('../../lib/lib-validator');
var parserObj = require('../../parser/jsonParser');
const config = require('../../../config');

class DataModel {

  constructor(Schema, DataDetailSchema) {
    this.Schema = Schema;
    this.DataDetailSchema = DataDetailSchema;
  }

  /**
   * Create data's restufl api .	 	
   * @param {object} input , This is a param with input.data and input,describe,author,key 
   * @returns {Promise}
   */
  create(input) {
    let asyncFucs = [];

    if (input.key) {
      var parserResult = parserObj.jsonParser(input.data, input.key);
    } else {
      var parserResult = parserObj.jsonParser(input.data);
    }

    if (parserResult.status === false) {
      reject({
        "status": false,
        "msg": parserResult.msg
      })
    }

    let inputSaveData = {
      describe: input.describe,
      author: input.author,
      count: input.data.length,
      size: sizeOf(input.data),
      key: parserResult.key
    }
    var saveDataResult = this.saveData(inputSaveData);

    return new Promise((resolve, reject) => {
      saveDataResult.then((data) => {
        console.time("!!!Create Data timer");

        let dataId = data._id.toString();
        var asyncDatas = this.splitData(dataId, parserResult.datas,parserResult.key),
          asyncDataLength = asyncDatas.length;

        asyncFucs.push(this.bulkSaveDataDetail(asyncDatas));

        Promise.all(asyncFucs).then(datadetails => {
          console.timeEnd("!!!Create Data timer");
          resolve(data);
        });

      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * this method want to split datas , in orders to insert mongodb datasDetails collection.
   * @param {string} dataId , this param mongodb data collection's objectId .
   * @param {object} datas , this param that user want to create restful api datas . 
   * @returns {Array}
   */
  splitData(dataId, datas,key) {
    let result = [],
      datasLength = datas.length,
      maxSize = this.maxSize || 10000,
      size = Math.ceil(datasLength / maxSize);

    for (var i = 0; i < datasLength; i++) {
      let obj = {
        data: datas[i],
        dataId: dataId,
				keyId : parseInt(datas[i][key]),
        isFinal: false || i == (size - 1)
      };
      result.push(obj);
    }
    return result;
  }

  /**
   * Create data to mongodb data collection. 
   * @param {object} input , This is a param with input.data and input,describe,author
   * @param {string} key , This is datas key name
   * @returns {Promise}
   */
  saveData(input) {

    validator.config = {
      describe: 'isNonEmpty',
      author: 'isNonEmpty'
    }

    var validResult = validator.validate(input);
    if (!validResult) {
      return Promise.reject({
        "status": false,
        "msg": "valid error"
      });
    }

    const schema = new this.Schema(input);
    let promise = new Promise((resolve, reject) => {
      schema.save((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            data
          );
        }
      });
    });
    return promise;
  }

  /**
   * Use MongoDB Bulk insert data to dataDetail collection. 
   * @param {object} datas  
   * @returns {Promise}
   */
  bulkSaveDataDetail(datas, callback) {
    let promise = new Promise((resolve, reject) => {
      this.DataDetailSchema.collection.insert(datas, (err, datas) => {
        if (err) {
          reject(err);
        } else {
          resolve(datas);
        }
      });
    });
    return promise;
  }

  /**
   * Find data from mongodb data collection  
   * @param {string} query, mongodb query string
   * @param {number} limitCount , find result limit , default is 10000
   * @returns {undefined}
   */
  find(query, limitCount) {
    let count = limitCount || 10000;
    return new Promise((resolve, reject) => {
      this.Schema.find(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }).sort({
        date: -1
      }).limit(count);
    });
  }

  /**
   * Remove all data that include data and dataDetails collection 
   * @param {string} id , data's objectId
   * @returns {Promise}
   */
  remove(id) {
    if (!id) {
      return Promise({
        status: false,
        msg: "valid error"
      })
    }

    var promise = new Promise((resolve, reject) => {
      console.time("!!!Remove Data timer");
      var removeDataPromise = this.removeDataByDataId(id);
      var removeDataDetailPromise = this.removeDataDetailsByDataId(id);
      Promise.all([removeDataPromise, removeDataDetailPromise]).then(data => {
        console.timeEnd("!!!Remove Data timer");
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
    return promise;
  }

  /**
   * Remove data from data collection 
   * @param {string} id , data's objectId
   * @returns {Promise}
   */
  removeDataByDataId(id) {
    var promise = new Promise((resolve, reject) => {
      this.Schema.findByIdAndRemove(id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return promise;
  }

  /**
   * Remove data from dataDetails collection 
   * @param {string} id, data's objectId
   * @returns {Promise}
   */
  removeDataDetailsByDataId(id) {
    if (!id) {
      return Promise.reject({
        status: false,
        msg: "valid error"
      })
    }

    return new Promise((resolve, reject) => {
      this.DataDetailSchema.collection.remove({
        dataId: id
      }, (err, msg) => {
        if (err) {
          reject(err);
        } else {
          resolve(msg);
        }
      });
    });
  }

  /**
   * Update dataDetail collection  
   * @param {string} query , user want to update query 
   * @param {newData} newData , user want to update data  
   * @returns {Promise}
   */
  updateDataDetail(query, newData) {
    return new Promise((resolve, reject) => {
      this.DataDetailSchema.findOneAndUpdate(query, {
        $set: {
          "data": newData
        }
      }, {
        "new": true
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    })
  }

  /**
   * Get All data from data collection. 
   * @param {number} limitCount , get all data limit
   * @returns {Promise} , and rosolve object , auhtor , describe , size, count, modifyDate
   */
  getAllData(limitCount) {
    let count = limitCount || 10;
    return new Promise((resolve, reject) => {
      let findPromise = this.find({}, count);
      findPromise.then((datas) => {
        resolve(datas);
      }).catch((err) => {
        reject(err);
      });
    });
  };

  /**
   * Get Data By objectId from dataDetail collection 
   * @param {string} id , objectId
   * @returns {Promise} , resolve object is author,createDate,updateDate,count,size,describe,url
   */
  getDataById(id) {
    return new Promise((resolve, reject) => {
      let findPromise = this.find({
        _id: id
      });
      findPromise.then((data) => {
        if (data) {
          var data = data[0]._doc;
          var keyId = data._id.toString();
          var url = config.server.domain + ':' + config.server.port + '/api/' + data.author + '/' + keyId + '-datas'
          resolve({
            "author": data.author,
            "createDate": data.date,
            "updateDate": data.date,
            "count": data.count,
            "size": data.size,
            "describe": data.describe,
            "url": url
          })
        } else {
          reject(null);
        }
      }).catch((err) => {
        reject({
          "status": false,
          "msg": err
        });
      });
    });
  }
}
module.exports = DataModel;
