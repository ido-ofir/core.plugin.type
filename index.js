
var getDefinitionObject = require('./getDefinitionObject.js');

var type = require('./type.js');

var types = [
    require('./types/any.js'),
    require('./types/boolean.js'),
    require('./types/number.js'),
    require('./types/string.js'),
    require('./types/array.js'),
    require('./types/object.js'),
    require('./types/object.properties.js'),
    require('./types/object.property.js'),
    require('./types/object.property.type.js'),
    require('./types/function.js'),
    require('./types/ref.js'),
    require('./types/ref.identifier.js'),
    require('./types/ref.type.js'),
    require('./types/text.js'),
    require('./types/list.js'),
    require('./types/schema.js'),
    require('./types/schemaItem.js'),
    require('./types/schemaKey.js'),
    require('./types/plugin.js'),
    require('./types/source.js'),
    require('./types/value.js'),
];

module.exports = {
    name: 'core.plugin.type',
    dependencies: [],
    init(definition, done){

        var core = this;

        type = type(core);

        var extend = {
            type: {
                findInSource(source, sourceElementId){
                    var m, t, id, type = core.typeOf(source);
                    if(type === 'object'){
                        for(m in source){
                            id = core.type.getId(source[m]);
                            t = (id && (id === sourceElementId)) ? 
                                source[m] :
                                core.type.findInSource(source[m], sourceElementId)
                            if(t){ return t; }
                        }
                    }
                    else if(type === 'array'){
                        return source.find(item => core.type.findInSource(item, sourceElementId));
                    }
                },
                createSource(meta, types){
                    if(core.isString(meta)){
                        meta = { type: meta };
                    }
                    if(!meta.id){ meta.id = core.uuid(); }
                    return core.type.toSource(meta, meta.value || core.type.getDefaultValue(meta.type, types));
                },
                toSource(meta, value){
                    return {
                        "core.source.element": { meta, value }
                    };
                },
                parseSource(source){
                    return source && source["core.source.element"];
                },
                isSourceElement(source){
                    return source && !!source['core.source.element'];
                },
                getId(source){
                    var element = source['core.source.element'];
                    return element && element.meta && element.meta.id;
                },
                getDefaultValue(typeName, types){
                    types = types || core.types;
                    let type = types[typeName];
                    if(!type){
                        throw new Error(`cannot find type '${ typeName }'`);
                    }
                    if(type.getDefaultValue){ return type.getDefaultValue(); }
                    if('defaultValue' in type){ return type.defaultValue; }
                    var schema = core.type.getSchema(typeName, types);
                    if(schema.length){
                        var value = {};
                        schema.map(item => {
                            var itemValue;
                            if('defaultValue' in item) { itemValue = item.defaultValue; }
                            else { itemValue = core.type.getDefaultValue(item.type); };
                            value[item.key] = itemValue;
                        });
                        return value;
                    }
                    return null;
                },
                buildObject(object, done){
                    var result = {};
                    var keys = Object.keys(object);
                    var count = keys.length;
                    if(!count){ return done && done(result); }
                    keys.map((key) => {
                        var item = object[key];
                        core.build(item, (built) => {
                            count -= 1;
                            result[key] = built;
                            if(!count){ done && done(result); }
                        });
                    });
                },
                buildArray(array, done){
                    var result = [];
                    var count = array.length;
                    if(!count){ return done && done(result); }
                    array.map((item, i) => {
                        core.build(item, (built) => {
                            count -= 1;
                            result[i] = built;
                            if(!count){ done && done(result); }
                        });
                    });
                },
                buildSourceElement(source, done){
                    var { value, meta } = core.type.parseSource(source);
                    var type = core.types[meta.type];
                    var typeToBuild = type;
                    
                    if (!type) throw new Error(`cannot find type '${meta.type}'`);
    
                    function finish(value, cb){
                        type.instance(meta, value);
                        if(core.isFunction(cb)){ cb(value); }
                        if(core.isFunction(done)){ done(value); }
                    }
    
                    while(typeToBuild && !typeToBuild.build){
                        typeToBuild = core.types[typeToBuild.extends];
                    }
    
                    if(!typeToBuild){ return finish(value); }
                    
                    return typeToBuild.build.call(core, value, finish);
                },
                getSchema(typeName, types){
                    types = types || core.types;
                    let type = types[typeName];
                    let schema = type.schema ? type.schema.concat([]) : [];
                    if(type.extends){
                        core.type.getSchema(type.extends, types).map((schemaItem) => {
                            for(let i = 0; i < schema.length; i++){
                                if(schema[i].key === schemaItem.key){ return; }
                            }
                            schema.push(schemaItem);
                        });
                    }
                    return schema;
                },
                getDefinitionObject: getDefinitionObject,
                
            },
            types: {},
            Type(name, dependencies, get, done){
                var definition = core.type.getDefinitionObject(name, dependencies, get, 'type', done);
                // return core.build(definition);
                var source = core.type.toSource({
                    id: definition.name,
                    key: definition.name,
                    type: 'type',
                    description: definition.description || ''
                }, definition)
                return core.build(source, definition.done);
            },
            
            
            build(source, done) {

                if (!source) { return done(source); }
                
                var core = this;

                if(core.type.isSourceElement(source)) {
                    return core.type.buildSourceElement(source, done);
                }
                if(core.isArray(source)){
                    return core.type.buildArray(source, done);
                }
                if(core.isObject(source)){
                    return core.type.buildObject(source, done);
                }

                done && done(source);
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