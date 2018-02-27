
function noop(){}

module.exports = {
  name: 'function',
  identifier: 'name',
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'a unique name for this function'
    },
    {
      key: 'description',
      type: 'string',
      description: 'describes the purpose of this function'
    },
    {
      key: 'code',
      type: 'string',
      description: 'the javascript code that makes the function'
    }
  ],
  build(def, done){
    var code = def.code;
    if(!code) throw new Error(`cannot find compiled code in function '${def.name}'}`);
    done(eval(code));
  },
  getDefaultValue(){
    return noop;
  }
};
