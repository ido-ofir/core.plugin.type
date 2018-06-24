


module.exports = function(core){

  function getValue(target, path){
    if(!target || !path || !path.length){ return target; }
    return getValue( target[path[0]], path.filter((t,i) => i) );
  }

  // immutably set [path] on [source] to [value].
  // if [value] is different then the current value a new object is returned
  // and all the sub objects or arrays that contained the change are cloned as well.
  // if [value] was not changed [source] is returned.
  function immutableSet(source, path, value){
    var result = Array.isArray(source) ? [].concat(source) : Object.assign({}, source);
    var target = result;
    var property = path.pop();
    path.map((t, i) => {
      target[t] = Array.isArray(target[t]) ? [].concat(target[t]) : Object.assign({}, target[t]);
      target = target[t];
    });
    if(target[property] === value){ // if nothing changed return the source
      return source;
    }
    target[property] = value;
    return result;
  }

  function setValue(target, path, value){
    if(!path || !path.length){ return value; }
    var v = immutableSet(target, [].concat(path), value);
    return v;
    // if(!target || !path || !path.length){ return value; }
    // if(path.length === 1){
    //   target[path[0]] = value;
    //   return target;
    // }
    // return setValue( target[path[0]], path.filter((t,i) => i) );
  }

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

  function Instance(type, meta, value){
    this.type = type;
    if(!core.isObject(meta)){ meta = { id: meta }; }
    this.meta = meta;
    this.id = meta.id;
    this.value = value;
    this._watchers = []; 
    this._events = {}; 
  }

  Instance.prototype = core.Emitter({
    setMeta(meta){
      this.meta = Object.assign({}, this.meta, meta);
      this._runWatchers();
      this._emit('meta', this);
      this._emit('change', this);
    },
    _emit(eventName, data){
      this.emit(eventName, data);
      this.type.emit(`instance.${ eventName }`, data);
    },
    _runWatchers(){
      this._watchers.map(watcher => watcher.onChange(this.value));
    },
    _set(path, value, cb){
        var prev = this.value;
        this.value = setValue(this.value, path, value);
        if(prev !== this.value){
          this.previousValue = prev;
          this._runWatchers();
          cb && cb(this.value);
          this._emit('change', this);
        }
        return this;
    },
    get(path){
        if(core.isString(path)){ path = [path]; }
        return getValue(this.value, path);
    },
    
    set(path, value, descriptor){
      if(arguments.length < 2){
        value = path;
        path = [];
      }
      this._set(path, value, () => {
        var update = Object.assign({}, {
          instanceId: this.id,
          type: 'set', 
          value: value,
          path: path
        }, descriptor);
        this._emit('update', update);
      });
    },
    unset(path){
        if(!path || !path.length){ return this.set(); }
        var key = path[path.length - 1];
        var path = path.slice(0, path.length - 1);
        var value = this.get(path);
        if(!value){ return; }
        var type = core.typeOf(value);
        if(type === 'array'){
          value = value.filter((t, i) => i !== key);
        }
        else if(type === 'object'){
          value = Object.assign({}, value);
          delete value[key];
        }
        this._set(path, value, () => {
          this.type.emit('update', { 
            type: 'unset', 
            path: path,
            instanceId: this.id
          });
        });
    },
    push(path, data, index){                
        var value = this.get(path);
        if(!core.isArray(value)){
            throw new Error(`${this.type.name} '${this.id}' cannot push to non Array at '${ path.join('.') }'`)
        }
        var newValue = [];
        value.map((t, i) => {
            if(i === index){ newValue.push(data); }
            newValue.push(t);
        });
        if(core.isUndefined(index)){
          newValue.push(data);
        }
        this._set(path, value, () => {
          this.type.emit('update', { 
            type: 'push', 
            path,
            data,
            index,
            instanceId: this.id
          });
        });
    },
    pop(path, items){
        var value = this.get(path);
        if(!core.isArray(value)){
          throw new Error(`${this.type.name} '${this.id}' cannot pop from non Array at '${ path.join('.') }'`)
        }
        var type = core.typeOf(items);
        var newValue = value.filter((t, i) => {
          if(type === 'number'){ return i !== items; }  // items === index
          if(type === 'array'){ return items.indexOf(t) === -1; }
          return true;
        });
        this._set(path, newValue, () => {
          this.type.emit('update', { 
            type: 'pop', 
            path,
            items,
            instanceId: this.id
          });
        });
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
        this.off();
        return this;
    }
  });




  function Type(definition){
    Object.assign(this, definition);
    this.instances = [];
    core.Emitter(this);
  }

  Type.prototype = {
    find(query){
      var value, type = typeof query;
      return this.instances.find(function(instance){
        if(type === 'string'){
          return instance.id === query;
        }
        if(type === 'object'){
            value = instance.get();
            for(var key in query){
              if(value[key] !== query[key]){
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
        instance = new Instance(this, id, value);
        this.instances.push(instance);
      }
      
      return instance;
    },
    create(meta, value){
      var instance = this.find(meta);              
      if(instance){
          if(arguments.length > 1){
              instance.set(value);
          }
      }
      else{
        instance = new Instance(this, meta, value);
        this.instances.push(instance);
      }
      this.emit('create', instance);
      return instance;
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
        key: 'schema',
        type: 'array',
        parameters: {
          itemsType: 'schemaItem'
        },
        description: 'A schema that defines the interface of this type',
        defaultValue: []
      },{
        key: 'description',
        type: 'text',
        description: 'Described the purpose of this type.',
      },{
        key: 'identifier',
        type: 'schemaKey',
        description: 'The field used to identify instances of this type',
        defaultValue: 'id'
      },{
        key: 'displayField',
        type: 'schemaKey',
        description: 'The field used to display instances of this type',
        defaultValue: 'key'
      },{
        key: 'descriptionField',
        type: 'schemaKey',
        description: 'The field used to display the description of instances of this type',
        defaultValue: 'description'
      },{
        key: 'defaultValue',
        type: 'any',
        description: `The default value of this type. used by generic types to create new instances.`,
      },{
        key: 'build',
        type: 'function',
        description: `An async constructor for this type`,
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
