define([
    "dojo/_base/declare",
    'm/myDom',
    'm/myModule',
    'dojo/dom'
], function(declare, myDom, myModule, dom) {
    return declare(null, {
        oldText: {},

        createMyDom: function(id) {
            myDom.start(id);
        },

        setText: function(id, text) {
            var node = dom.byId(id);
            this.oldText[id] = node.innerHTML;
            node.innerHTML = text;
        },

        restoreText: function(id) {
            var node = dom.byId(id);
            node.innerHTML = this.oldText[id];
            delete this.oldText[id];
        },

        testModule: function() {
            myModule.start();
        }
    });
});
