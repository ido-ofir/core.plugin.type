
module.exports = {
    name: 'source',
    identifier: 'id',
    schema: [
        {
            key: 'id',
            description: 'a unique id for this source object',
            type: 'string',
            isRequired: true,
            defaultValue: ''
        },
        {
            key: 'items',
            description: 'an array of items to build.',
            type: 'array',
            defaultValue: []
        }
    ],
    build(def, done){

        let core = this;

        core.buildObject(def, (built) => {
            console.log('def', def);
            done(def);
        });

    }
};
  
  