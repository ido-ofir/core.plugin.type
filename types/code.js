
module.exports = {
    name: 'code',
    schema: [
        {
            key: 'source',
            description: 'the un-compiled source code.',
            type: 'string',
            defaultValue: "''"
        },
        {
            key: 'code',
            description: 'the compiled code.',
            type: 'string',
            defaultValue: "''"
        }
    ],
    build(def, done){

        let core = this;

        core.build(def.items, () => {
            done(def);
        });

    }
};
  
  