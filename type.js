


module.exports = function(core){



  function Watcher(instance, onChange){
    this.instance = instance;
    this.onChange = onChange;
  }

  Watcher.prototype = {
    done(){
      this.instance.unwatch(this);
      this.kill();
    },
    kill(){
        delete this.instance;
        delete this.onChange;
    }
  };

  function Instance(type, id, value){
    this.type = type;
    this.id = id;
    this.value = value;
    this._watchers = []; 
    core.Emitter(this);           
  }

  Instance.prototype = {
    get(){
        return this.value;
    },
    set(value){
        this.value = value;
        this._watchers.map(watcher => watcher.onChange(value));
        this.emit('change', this);
        return this;
    },
    watch(onChange){
        var watcher = new Watcher(this, onChange);
        this._watchers.push(watcher);
        return watcher;
    },
    unwatch(watcher){
        this._watchers.splice(this._watchers.indexOf(watcher), 1);
        return this;
    },
    kill(){
        this._watchers.map(watcher => {
          watcher.onChange(null);
          watcher.kill();
        });
        this.emit('kill', this);
        return this;
    }
  };




  function Type(definition){
    Object.assign(this, definition);
    this.instances = [];
  }

  Type.prototype = {
    find(query){
      var type = typeof query;
      var identifier = this.identifier;
      return this.instances.find(function(instance){
        if(type === 'string'){
          return instance[identifier] === query;
        }
        if(type === 'object'){
            for(var key in query){
              if(instance[key] !== query[key]){
                return false;
              }
            }
            return true;
        }
        if(type === 'function'){
          return query(instance);
        }
      });
      throw new Error('cannot find type from ' + type);
    },
    instance(id, value){
      var instance = this.find(id);              
      if(instance){
          if(arguments.length > 1){
              instance.set(value);
          }
      }
      else{
        instance = new Instance(this.name, id, value);
        this.instances.push(instance);
      }
      return instance;
    },
    getSchema(){
      var schema = this.schema || [];
      if(this.extends){
          schema = core.types[this.extends].getSchema().concat(schema);
      }
      return schema;
    },
    create(){
        var result = { 'core.type': this.name };
        this.getSchema().map(item => {
            var type = core.types[item.type];
            result[item.key] = type.getDefaultValue ? type.getDefaultValue() : type.create();
        });
        return result;
    }
  };

  return {
    name: 'type',
    identifier: 'name',
    instances: [],
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
        params: { ofType: 'schemaItem' },
        description: 'A schema that defines the interface of this type',
        defaultValue: []
      },{
        key: 'build',
        type: 'function',
        description: `An async constructor for this type`,
      },{
        key: 'getDefaultValue',
        type: 'function',
        description: `An optional function to get the default value for this type.`,
      }
    ],
    build(definition, done){
      var core = this;
      var type = new Type(definition);
      // var type = definition;
      core.types[definition.name] = type;
      done(type);
    }
  };

};
