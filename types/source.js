
module.exports = {
    name: 'source',
    identifier: 'id',
    schema: [
        {
            key: 'id',
            description: 'a unique id for this source object',
            type: 'string',
            isRequired: true
        },
        {
            key: 'types',
            description: 'an array of types. types will be executed before instances',
            type: 'array',
            params: { ofType: 'type' }
        },
        {
            key: 'instances',
            description: 'an array of instances',
            type: 'array'
        }
    ],
    build(def, done){

        let core = this;

        core.build(def.types, () => {
            core.build(def.instances, () => {
                done(def);
            });
        });

    }
};
  
  