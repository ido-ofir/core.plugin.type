

function Set(name){
  return function set(path, value){
    if(arguments.length === 1){
      value = path;
      path = [];
    }
    if(!this.isArray(path)){
      path = [path];
    }
    return this.tree.set(['plugins', name].concat(path) , value);
  }
}
function Get(name){
  return function get(path){
    if(!this.isArray(path)){
      path = [path];
    }
    return this.tree.get(['plugins', name].concat(path));
  }
}
function Select(name){
  return function get(path){
    if(!this.isArray(path)){
      path = [path];
    }
    return this.tree.select(['plugins', name].concat(path));
  }
}

module.exports = {
  name: 'plugin',
  identifier: 'name',
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'a unique name for this plugin'
    },
    {
      key: 'description',
      type: 'string',
      description: 'describes the purpose of this plugin'
    },
    {
      key: 'extend',
      type: 'object',
      description: 'extend the core object with your own properties'
    },
    {
      key: 'init',
      type: 'function',
      description: 'initialize the plugin'
    }
  ],
  build(definition){
    return this.plugin(definition);
  }
};
