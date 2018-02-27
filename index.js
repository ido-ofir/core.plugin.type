
var getDefinitionObject = require('./getDefinitionObject.js');

var type = require('./type.js');

var types = [
    require('./types/any.js'),
    require('./types/boolean.js'),
    require('./types/number.js'),
    require('./types/string.js'),
    require('./types/array.js'),
    require('./types/typedArray.js'),
    require('./types/object.js'),
    require('./types/function.js'),
    require('./types/schema.js'),
    require('./types/schemaItem.js'),
    require('./types/keyValue.js'),
    require('./types/plugin.js'),
    require('./types/source.js'),
];

module.exports = {
    name: 'core.plugin.type',
    dependencies: [],
    init(definition, done){

        var core = this;

        type = type(core);

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
            types: {},
            Type(name, dependencies, get){
                var definition = this.getDefinitionObject(name, dependencies, get, 'type');    
                return this.build(definition);
            },
            getDefinitionObject: getDefinitionObject,
            build(source, done) {

                var core = this;
    
                if (!source) { return source; }
    
                var result, typeName = source['core.type'];
    
                if (!typeName) {
                    var count = 0;
                    if(core.isArray(source)){
                        result = [];
                        return source.map((t, i) => {
                            count += 1;
                            core.build(t, (build) => {
                                result[i] = build;
                                count -= 1;
                                if(!count){ done && done(result); }
                            });
                        });
                    }
                    if(core.isObject(source)){
                        result = {};
                        Object.keys(source).map((key) => {
                            count += 1;
                            core.build(source[key], (build) => {
                                count -= 1;
                                result[key] = build;
                                if(!count){ done && done(result); }
                            });
                        });
                    }
                    else{
                        done && done(source);
                    }
                }

                else{
                    var parent = null;
                    var type = core.types[typeName];
                    var id = source[type.identifier];
                    var result = source;

                    if (!type) throw new Error(`cannot find type '${typeName}'`);
                    if(!type.build){ 
                        if(id){
                            type.instance(id, source);
                        }
                        return source;
                    }
        
                    if(type.extends){
                        parent = core.types[type.extends];
                        if(!parent){
                            throw new Error(`cannot find type '${type.extends}', '${ typeName }' tries to extend it.`);
                        }
                    }
                    return type.build.call(core, result, function(built){
                        var id = source[type.identifier];
                        if(id){
                            type.instance(id, built);
                        }
                        done && done(built);
                    }, done);
                }
    
            },
            instance(typeName, id, value){
                var args = core.isObject(arguments[0]) ? arguments[0] : { type: typeName, id, value };
                var type = core.types[args.type];
                if(!type){
                    return console.warn(`cannot find type '${ args.type }'`);
                }
                return type.instance(args.id, args.value);
            },
            getSchema(typeName){
                var type = core.types[typeName];
                if(!type){
                    throw new Error(`cannot find type '${ typeName }'`);
                }
                var schema = type.schema;
                if(type.extends){
                    schema = core.getSchema(type.extends).concat(schema);
                }
                return schema;
            },
            create(typeName){
                var result = {}
                var type = core.types[typeName];
                if(!type){
                    throw new Error(`cannot find type '${ typeName }'`);
                }
                if(type.extends){
                    result = core.create(type.extends);
                }
                result['core.type'] = typeName;
                type.schema.map(item => {
                    var itemType = core.types[item.type];
                    if(itemType.getDefaultValue){
                        result[item.key] = itemType.getDefaultValue();
                    }
                    else{
                        result[item.key] = core.create(item.type);
                    }
                });
                return result;
            }
        };

        core.extend(extend);

        type.build.call(core, type, (built) => {
            core.types.type = built;
            types.map(core.Type);
            done(extend);
        });



    }
}