

module.exports = {
  name: 'schema',
  extends: 'array',
  schema: [
    {
      key: 'ofType',
      type: 'ref.type',
      description: 'a schema is an array of "schemaItem"',
      defaultValue: 'schemaItem'
    }
  ],
  build(schema, done){
    var items = (schema.items || []).map(function(item){
      if(!item['core.type']){
        item['core.type'] = 'schemaItem';
      }
      return item;
    });
    return this.build(items, done);
  }
};
