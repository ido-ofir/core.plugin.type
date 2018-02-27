module.exports = {
  name: 'typedArray',
  extends: 'array',
  schema: [
    {
      key: 'ofType',
      type: 'string',
      description: 'the type of the items in this array'
    }
  ],
  build(def, done){
    done(def.items);
  },
  getDefaultValue(){
    return [];
  }
};
