# core.plugin.type

defines types using a schema

```js
let core = new require('core.constructor')();
 
core.plugin(
    require('core.plugin.type')
);
 
core.Type({
    name: 'someType',
    schema: [
        {
            key: 'name',
            type: 'string',
            description: 'The name of the instance',
            isRequired: true
        }
    ]
});
```
