class DataApiModel {

  constructor(DataDetailSchema) {
    this.DataDetailSchema = DataDetailSchema;
  }

    /**
     * Get all objectId equal id of data
     * @param {string} id , this id is mongodb objectId
     * @returns {promise}
     */
  get(id) {
    const query = {
      dataId: id
    };
    return this.DataDetailSchema.find(query)
            .then((datas) => {
              const result = [];
              const datasLength = datas.length || 0;

              for (let i = 0; i < datasLength; i++) {
                result.push(datas[i].data);
              }
              return Promise.resolve(result);
            }).catch((err) => {
              throw (err);
            });
  }

    /**
     * Get data by id
     * @param {string} id , this id is mongodb objectId
     * @param {string} selectId , this id is restful api get id
     * @returns {promise}
     */
  getById(id, selectId) {
    const query = {
      dataId: id,
      keyId: selectId
    };
    return new Promise((resolve, reject) => {
      this.DataDetailSchema.find(query, (err, datas) => {
        if (err) {
          reject(err);
        } else {
          resolve(datas[0].data);
        }
      });
    });
  }
  getDataKey(id) {

  }
}
module.exports = DataApiModel;
