

module.exports = {
    name: 'core.plugin.type',
    dependencies: [],
    init(definition, done){

        var core = this;

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
                boolean: require('./types/boolean.js'),
                number: require('./types/number.js'),
                string: require('./types/string.js'),
                array: require('./types/array.js'),
                object: require('./types/object.js'),
                function: require('./types/function.js'),
                type: require('./types/type.js'),
                schema: require('./types/schema.js'),
                code: require('./types/code.js'),
                keyValue: require('./types/keyValue.js'),
                plugin: require('./types/plugin.js'),
            },
            Type(name, dependencies, get){
                var definition = this.getDefinitionObject(name, dependencies, get, 'type');    
                return this.build(definition);
            },
            build(source, done) {

                var core = this;
    
                if (!source) { return source; }
    
                var typeName = source['$_type'];
    
                if (!typeName) {
                    if(core.isArray(source)){
                        return source.map(t => core.build(t));
                    }
                    if(core.isObject(source)){
                        return core.assign({}, source, function(property, key, source){
                            return core.build(property);
                        });
                    }
                    return source;
                }
    
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
        };

        core.extend(extend);

        done(extend);

    }
}