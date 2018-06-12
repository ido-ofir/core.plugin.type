module.exports = {
  name: 'string',
  validate(value, core){
    return core.isString(value);
  },
  defaultValue: ''
};
