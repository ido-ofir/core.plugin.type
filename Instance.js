

function Instance(type, id, value){
    this.type = type;
    this.id = id;
    this.value = value;
    this.watchers = [];            
}

Instance.prototype = {
    get(){
        return this.value;
    },
    set(value){
        this.value = value;
        this.watchers.map(watcher => watcher.onChange(value));
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

module.exports = Instance;