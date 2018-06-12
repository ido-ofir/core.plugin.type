
function noop(){}

module.exports = {
  name: 'function',
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'a unique name for this function',
      defaultValue: ''
    },
    {
      key: 'code',
      type: 'string',
      description: 'the javascript code that makes the function',
      defaultValue: 'function(){}'
    }
  ],
  build(def, done){
    var code = def.code;
    if(!code) throw new Error(`cannot find compiled code in function '${def.name}'}`);
    done(eval(code));
  },
  defaultValue: noop
};
