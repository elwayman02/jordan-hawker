window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
    workflow: [
        {handler: "silence", matchMessage: "Ember.create is deprecated in favor of Object.create"},
        {
            handler: "silence",
            matchMessage: "Using `Ember.HTMLBars.makeBoundHelper` is deprecated. Please refactor to using `Ember.Helper` or `Ember.Helper.helper`."
        },
        {
            handler: "silence",
            matchMessage: "Using Ember.HTMLBars._registerHelper is deprecated. Helpers (even dashless ones) are automatically resolved."
        },
        {
            handler: "silence",
            matchMessage: "Passing the dependentKeys after the callback function in Ember.observer is deprecated. Ensure the callback function is the last argument."
        },
        {handler: "silence", matchMessage: "Ember.reduceComputed is deprecated. Replace it with plain array methods"},
        {
            handler: "silence",
            matchMessage: "`lookupFactory` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container."
        },
        {
            handler: "silence",
            matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container."
        },
        {handler: "silence", matchMessage: "Ember.keys is deprecated in favor of Object.keys"},
        {
            handler: "silence",
            matchMessage: "Ember.View is deprecated. Consult the Deprecations Guide for a migration strategy."
        },
        {
            handler: "silence",
            matchMessage: "You attempted to access `id` from `(generated index controller)`, but object proxying is deprecated. Please use `model.id` instead."
        },
        {
            handler: "silence",
            matchMessage: "You attempted to access `title` from `(generated index controller)`, but object proxying is deprecated. Please use `model.title` instead."
        },
        {
            handler: "silence",
            matchMessage: "You attempted to access `date` from `(generated index controller)`, but object proxying is deprecated. Please use `model.date` instead."
        },
        {
            handler: "silence",
            matchMessage: "You attempted to access `body` from `(generated index controller)`, but object proxying is deprecated. Please use `model.body` instead."
        }
    ]
};
