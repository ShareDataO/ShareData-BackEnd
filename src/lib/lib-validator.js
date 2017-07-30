const validator = {
  types: {},
  messages: [],
  config: {},

  validate(data) {
    let i;
    let msg;
    let type;
    let checker;
    let resultOk;
    this.messages = [];

    if (typeof (data) === 'string') {
      const configLen = this.config.length || 0;
      for (i = 0; i < configLen; i++) {
        type = this.config[i];
        checker = this.types[type];

        if (!type) {
          continue;
        }
        if (!checker) {
          throw new Error({
            name: 'ValidationError',
            message: `No handler to validate type ${type}`
          });
        }

        resultOk = checker.validate(data);
        if (!resultOk) {
          msg = `Invalid value for , ${checker.instructions}`;
          this.messages.push(msg);
        }
      }

    } else if (typeof (data) === 'object') {
      for (i in data) {
        if (Object.prototype.hasOwnProperty.call(data, i)) {
          type = this.config[i];
          checker = this.types[type];

          if (!type) {
            continue;
          }
          if (!checker) {
            throw new Error({
              name: 'ValidationError',
              message: `No handler to validate type ${type}`
            });
          }

          resultOk = checker.validate(data[i]);
          if (!resultOk) {
            msg = `Invalid value for *${i}*, ${checker.instructions}`;
            this.messages.push(msg);
          }
        }
      }
    }

    return this.noErrors();
  },
  noErrors() {
    return this.messages.length === 0;
  }
};

validator.types.isNonEmpty = {
  validate(value) {
    if (typeof value === 'undefined') {
      return false;
    }
    return value.replace(/(^\s*)|(\s*$)/g, '').length !== 0;
  },
  instructions: "the value can't be empty"
};

validator.types.isArray = {
  validate(value) {
    return Array.isArray(value);
  },
  instructions: "the value can't be empty"
};

validator.types.isArrayAndHaveData = {
  validate(value) {
    return Array.isArray(value) && value.length > 0;
  },
  instructions: "the value can't be empty"
};

module.exports = validator;
