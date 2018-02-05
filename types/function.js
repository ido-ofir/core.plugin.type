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
  build(target, path){
    var code = target.code;
    if(!code) throw new Error(`cannot find compiled code in function ${this.name}.${path.join('.')}`);
    return eval(code);
  }
};
