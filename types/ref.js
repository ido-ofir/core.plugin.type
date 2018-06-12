module.exports = {
  name: 'ref',
  schema: [{
    key: 'type',
    type: 'ref.type',
    defaultValue: 'string',
  },{
    key: 'identifier',
    type: 'ref.identifier',
    defaultValue: '',
  }]
};
