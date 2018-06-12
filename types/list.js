module.exports = {
  name: 'list',
  schema: [
    {
      key: 'items',
      type: 'array',
      description: 'the elements in the list',
      defaultValue: []
    }
  ],
  build(def, done){
    var core = this;
    core.buildObject(def, function(built) {
      done(built.items);
    });
  },
  defaultValue: []
};
