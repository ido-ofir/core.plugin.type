module.exports = {
  name: 'type',
  identifier: 'name',
  instances: {},
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'The name of the type.',
      isRequired: true
    },{
      key: 'identifier',
      type: 'string',
      description: 'The key used to identify instances of this type',
      defaultValue: 'id'
    },{
      key: 'schema',
      type: 'array',
      content: { type: 'schemaItem' },
      description: 'A schema that defines the interface of this type',
      defaultValue: []
    },{
      key: 'build',
      type: 'function',
      description: `An async constructor for this type`,
    }
  ],
  build(definition, done){
    var core = this;
    var type = definition;
    type.instances = {};
    core.types[definition.name] = type;
    done(type);
  }
};
