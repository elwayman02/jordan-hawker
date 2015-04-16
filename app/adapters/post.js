import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    host: 'https://api.tumblr.com',
    namespace: 'v2/blog/jordanhawker.tumblr.com',
    ajaxOptions: function() {
        var hash = this._super.apply(this, arguments);
        if (!hash.data) {
            hash.data = {};
        }
        hash.data.api_key = 'djHwrb13Yd636cWzgzjRms29YwoB3fmHp0VXG4mB9GEAxcB6MX';
        hash.dataType = 'jsonp';
        return hash;
    }
});
