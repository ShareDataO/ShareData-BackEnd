var validator = {
  types: {},
  messages: [],
  config: {},

  validate: function(data) {
    var i, msg, type, checker, result_ok;
    this.messages = [];

    if (typeof(data) === 'string') {
      var configLen = this.config.length || 0;
      for (var i = 0; i < configLen; i++) {
        type = this.config[i];
        checker = this.types[type];

        if (!type) {
          continue;
        }
        if (!checker) {
          throw {
            name: "ValidationError",
            message: "No handler to validate type " + type
          };
        }

        result_ok = checker.validate(data);
        if (!result_ok) {
          msg = "Invalid value for , " + checker.instructions;
          this.messages.push(msg);
        }
      }

    } else if (typeof(data) === 'object') {
      for (i in data) {
        if (data.hasOwnProperty(i)) {
          type = this.config[i];
          checker = this.types[type];

          if (!type) {
            continue;
          }
          if (!checker) {
            throw {
              name: "ValidationError",
              message: "No handler to validate type " + type
            };
          }

          result_ok = checker.validate(data[i]);
          if (!result_ok) {
            msg = "Invalid value for *" + i + "*, " + checker.instructions;
            this.messages.push(msg);
          }
        }
      }
    }

    return this.noErrors();
  },
  noErrors: function() {
    return this.messages.length === 0;
  }
}

validator.types.isNonEmpty = {
  validate: function(value) {
    return value.replace(/(^\s*)|(\s*$)/g, "").length !== 0;
  },
  instructions: "the value can't be empty"
};

validator.types.isArray = {
  validate: function(value) {
    return Array.isArray(value); 
  },
  instructions: "the value can't be empty"
};

validator.types.isArrayAndHaveData = {
  validate: function(value) {
    return Array.isArray(value) && value.length>0; 
  },
  instructions: "the value can't be empty"
};

module.exports = validator;
