module.exports = {
  name: 'array',
  identifier: 'name',
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'a unique name for this array'
    },
    {
      key: 'description',
      type: 'string',
      description: 'describes the purpose of this array'
    },
    {
      key: 'items',
      type: 'array',
      description: 'the items in the array'
    }
  ],
  build(def, done){
    done(def.items);
  },
  getDefaultValue(){
    return [];
  }
};
