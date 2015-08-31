import StorageObject from 'ember-local-storage/local/object';

export default StorageObject.extend({
    storageKey: 'visitor',
    initialContent: {
        hideSplash: false
    }
});
