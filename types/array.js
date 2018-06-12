module.exports = {
  name: 'array',
  schema: [
    {
      key: 'ofType',
      type: 'ref.type',
      description: 'the type of the items that are expected to be in this array',
      defaultValue: ''
    },
    {
      key: 'items',
      type: 'array',
      description: 'the items in the array',
      defaultValue: []
    }
  ],
  build(def, done){
    done(def.items);
  },
  defaultValue: []
};
