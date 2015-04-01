define([
    "dojo/_base/array",
    "dojo/dom",
    "dojo/query",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/dom-construct"
], function(array, dom, query, domAttr, domClass, domStyle, domGeom, domConstruct) {

    return {
        start: function(id) {
            this.addLi(id);
            this.addSpan(id);
        },

        addLi: function(id) {
            var node = dom.byId(id),
                ul = domConstruct.create("ul", {}, node);
            for (var i = 0; i < 6; i++) {
                domConstruct.create("li", {}, ul);
            }
        },

        addSpan: function(id) {
            var node = dom.byId(id); // 查找id为node的节点
            array.forEach(node.firstChild.children, function(li) {
                var span = domConstruct.create("span", {
                    "class": "red",
                    innerHTML: "red"
                }, li); // 为每个li标签添加span标签
                domClass.contains(span, "red"); // 判断span是否有名字为red的class
                domClass.toggle(span, "active"); // 添加或删除active class
                domStyle.set(span, {
                    width: "100px",
                    height: "60px",
                    top: 0,
                    left: 0
                }); // 设置span的宽和高
                var className = domAttr.get(span, "class"); // 返回red、active，获取span的class属性。
                console.log(className);
                // domGeom.getMarginBox(span); // {l:0,t:0,w:100,h:60}
            }, this); // 查询class为node的所有li标签
        }
    };
});
