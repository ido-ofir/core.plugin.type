
var getDefinitionObject = require('./getDefinitionObject.js');

var types = [
    require('./types/boolean.js'),
    require('./types/number.js'),
    require('./types/string.js'),
    require('./types/array.js'),
    require('./types/object.js'),
    require('./types/function.js'),
    require('./types/schema.js'),
    require('./types/schemaItem.js'),
    require('./types/keyValue.js'),
    require('./types/plugin.js'),
];

module.exports = {
    name: 'core.plugin.type',
    dependencies: [],
    init(definition, done){

        var core = this;

        function Instance(type, id, value){
            this.type = type;
            this.id = id;
            this.value = value;
            this.watchers = []; 
            core.Emitter(this);           
        }
        
        Instance.prototype = {
            get(){
                return this.value;
            },
            set(value){
                this.value = value;
                this.watchers.map(watcher => watcher.onChange(value));
                this.emit('change', this);
                return this;
            },
            watch(onChange){
                var watcher = new Watcher(this, onChange);
                this.watchers.push(watcher);
                return watcher;
            },
            unwatch(watcher){
                this.watchers.splice(this.watchers.indexOf(watcher), 1);
                return this;
            },
            kill(){
                this.watchers.map(watcher => watcher.onChange(null));
                this.emit('kill', this);
                return this;
            }
        };
        
        function Watcher(instance, onChange){
            this.instance = instance;
            this.onChange = onChange;
        }
        
        Watcher.prototype = {
            kill(){
                this.instance.unwatch(this);
                delete this.instance;
                delete this.onChange;
            }
        };

        var extend = {
            nativeTypes: {
                undefined(v){ return core.isUndefined(v); },
                null(v){ return core.isNull(v); },
                boolean(v){ return core.isBoolean(v); },
                string(v){ return core.isString(v); },
                number(v){ return core.isNumber(v); },
                array(v){ return core.isArray(v); },
                object(v){ return core.isObject(v); },
                function(v){ return core.isFunction(v); },
                any(v){ return true; }
            },
            types: {
                type: require('./types/type.js')
            },
            Type(name, dependencies, get){
                var definition = this.getDefinitionObject(name, dependencies, get, 'type');    
                return this.build(definition);
            },
            getDefinitionObject: getDefinitionObject,
            build(source, done) {

                var core = this;
    
                if (!source) { return source; }
    
                var result, typeName = source['$_type'];
    
                if (!typeName) {
                    var count = 0;
                    if(core.isArray(source)){
                        result = [];
                        return source.map((t, i) => {
                            count += 1;
                            core.build(t, (build) => {
                                result[i] = build;
                                count -= 1;
                                if(!count){ done(result); }
                            });
                        });
                    }
                    if(core.isObject(source)){
                        result = {};
                        count += 1;
                        Object.keys(source).map((key) => {
                            core.build(source[key], (build) => {
                                count -= 1;
                                result[key] = build;
                                if(!count){ done(result); }
                            });
                        });
                    }
                    else{
                        done(source);
                    }
                }

                else{
                    var parent = null;
                    var result = source;
                    var type = core.types[typeName];
        
                    if (!type) throw new Error(`cannot find type '${typeName}'`);
                    if(!type.build){ return type; }
        
                    if(type.extends){
                        parent = core.types[type.extends];
                        if(!parent){
                            throw new Error(`cannot find type '${type.extends}', '${ typeName }' tries to extend it.`);
                        }
                    }
        
                    return type.build.call(core, result, function(built, done){
                        if(!parent){ 
                            return built; 
                        }
                        return core.build(core.assign({}, built, { $_type: parent.name }), done);
                    }, done);
                }
    
            },
            instance(type, id, value){
                var args = core.isObject(type) ? type : { type, id, value };
                var instance, types = core.types;
                if(!types[type]){
                    console.warn(`cannot find type ${ type }`)
                    types[type] = { instances: {} };
                }
                instance = (types[type].instances[id]);              
                if(instance){
                    if(arguments.length > 2){
                        instance.set(args.value);
                    }
                    return instance;
                }
                else{
                    instance = new Instance(args.type, args.id, args.value);
                    types[type].instances[id] = instance;
                    return instance;
                }
            }
        };

        core.extend(extend);

        types.map(core.Type);


        done(extend);

    }
}