module.exports = {
  name: 'any',
  identifier: 'name',
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'a unique name for this property'
    },
    {
      key: 'description',
      type: 'string',
      description: 'describes the meaning of this property'
    },
    {
      key: 'value',
      type: 'string',
      description: 'the javascript code of this property'
    }
  ],
  validate(){
    return true;
  },
  build(def, done){
    done(eval(def.value));
  },
  getDefaultValue(){
    return true;
  }
};
