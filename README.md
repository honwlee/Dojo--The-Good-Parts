Dojo: 语言精粹

Dojo工具箱包含很多部分：
Dojo：核心库；
Dijit：控件库，用于构建UI小部件；
Dojox：扩展库；
Util：工具包，包含打包工具、测试工具以及文档工具等。


本篇简单介绍下Dojo的语言结构以及其精华部分的语法。
[Dojo语法详细](http://dojotoolkit.org/reference-guide/1.10/dojo/)

[`dojo/_base/array`](http://dojotoolkit.org/reference-guide/1.10/dojo/_base/array.html)
-----------------
在原生的JavaScript中操作数组的方法比较少，并且不同浏览器其实现标准也有差异。Dojo对原生的数组进行了封装和扩展，增加了一些比较方便的操作方法。
##### `array.every()`
every() ，从其字面意义上可以很容易理解，它的作用就是判断数组中的成员是否都满足所给条件，与forEach方法一样，every方法也会对数组中的成员进行遍历。但是有所不同的是，只要有一个成员不满足所给条件，该方法就会停止遍历，并返回false的结果。当然如果所有成员都满足所给条件，该方法就会遍历所有成员，并返回true的结果。
```javascript
array.every([1,2,3,4],function(item){
  return item > 1; // false
  // return item > 0; // true
});
```
##### `array.filter()`
filter()，对数组进行筛选，返回满足条件的成员的集合。
```javascript
array.filter([1,2,3,4],function(item){
  return item > 1; // [2,3,4]
});
```
##### `array.forEach()`
forEach()，遍历数组。
```javascript
require(["dojo/_base/array"], function(array){
  var foo = {
    myMethod: function(el){
        console.log(el);
    }
  };

  array.forEach(["a","b","c"],function(item){
    this.myMethod(item);
  }, foo);
  //outputs: a b c
});
```
##### `array.indexOf()`
indexOf()，返回所给成员的索引，如果数组中有多个满足条件的成员则，返回第一个的索引，如果没有则返回-1。
##### `array.lastIndexOf()`
lastIndexOf()，与indexOf类似，但是是返回满足条件的最后一个的索引。
##### `array.map()`
map()，遍历数组，将每个成员传递给回调函数，返回更改的新数组。
```javascript
// a query to a map service returns a featureSet, lets make an array of just one attribute:
// featureSet looks something like this (condensed for example): {features:[{attributes:{ZIP:63385},geometry:{rings:[...]},{attributes:{ZIP:63301},geometry:{rings:[...]},{attributes:{ZIP:63867},geometry:{rings:[...]}]};
zips = array.map(featureSet.features, function(zipPolys) {
  return zipPolys.attributes.ZIP;
});
// zips = [63385, 63301, 63867]
```
##### `array.some()`
some()，判断数组中是否有成员满足所给条件。
##### 注意：
`every, map, forEach, some, filter`这些方法都可以接收第三个参数以绑定方法的作用域。

[`dojo/_base/lang`](http://dojotoolkit.org/reference-guide/1.10/dojo/_base/lang.html)
--------------
Lang是一个经常被使用的类，扩充了JS语言。
##### `lang.clone()`
复制对象或节点，返回新的对象或节点。
```javascript
require(["dojo/_base/lang"], function(lang){
  // clone an object
  var obj = { a:"b", c:"d" };
  var thing = lang.clone(obj);
  // clone an array
  var newarray = lang.clone(["a", "b", "c"]);
});
```
##### `lang.mixin()`
Mixin合并对象，将一个对象合并到另一个对象中，mixin只能在对象间使用
```javascript
require(["dojo/_base/lang"], function(lang){
  var a = { b: "c", d: "e" };
  lang.mixin(a, { d: "f", g: "h" });
  console.log(a); // b: c, d: f, g: h
});
```
##### `lang.hitch()`
Hitch返回一个绑定特定作用对象的方法。
```javascript
require(["dojo/_base/lang"], function(lang){
  var myObj = {
    foo: "bar",
    method: function(someArg){
      console.log(someArg + " " + this.foo);
    }
  };

  var func = lang.hitch(myObj, "method");

  func("foo");
  //outputs: foo bar
});
```

匿名函数的写法：
```javascript
require(["dojo/_base/lang"], function(lang){
  var myObj = {
    foo: "bar",
    method: function(someArg){
      console.log(someArg + " " + this.foo);
    }
  };

  var func = lang.hitch(myObj, function(someArg){
    //this = myObj
    this.method(someArg);
  });

  func("foo");
  //outputs: foo bar
});
```

[`dojo/Deferred`](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html)
--------------
管理异步回调函数间的通讯。deferred是一个私有接口不能被返回去调用其他代码。该部分职责由promise担当。详情请查看`dojo/promise/Promise`。
异步延迟是Defferd的基本用武之地。
```javascript
require(["dojo/Deferred", "dojo/dom", "dojo/on", "dojo/domReady!"],
function(Deferred, dom, on){
  function asyncProcess(){
    var deferred = new Deferred();

    dom.byId("output").innerHTML = "I'm running...";

    setTimeout(function(){
      deferred.resolve("success");
    }, 1000);

    return deferred.promise;
  }

  on(dom.byId("startButton"), "click", function(){
    var process = asyncProcess();
    process.then(function(results){
      dom.byId("output").innerHTML = "I'm finished, and the result was: " + results;
    });
  });

});
```
```html
<h1>Output:</h1>
<div id="output">Not yet started.</div>
<button type="button" id="startButton">Start</button>
```
##### 注意:
不要返回deferred本身，只返回其promise：`return deferred.promise;`

[`dojo/promise/all`](http://dojotoolkit.org/reference-guide/1.10/dojo/promise/all.html)
------------------
集结多个promise并返回新的promise，当所有promise执行完成后再执行新promise。
```javascript
// inside of a calss member function: ('dojo/promise/all', 'esri/tasks/query', 'esri/tasks/QueryTask' are required)
//query to get geometries of all zips from map service
var zipArray = [63385, 63301, 6387];
var queryTaskPoints = new QueryTask(url_1);
var queryTaskPolys = new QueryTask(url_2);

var zipWhereClause = "ZIP IN (" + ZipArray.join(",") + ")";

var query1 = new Query();
query1.where = zipWhereClause;
query1.outFields = ['*'];
query1.maxAllowableOffset = 1000;
query1.returnGeometry = true;
query1.outSpatialReference = this.map.spatialReference;

var query2 = new Query();
query2.where = zipWhereClause;
query2.outFields = ['*'];
query2.maxAllowableOffset = 1000;
query2.returnGeometry = true;
query2.outSpatialReference = this.map.spatialReference;

all([queryTaskPoints.execute(query1), queryTaskPolys.execute(query2)]).then(lang.hitch(this, 'viewZipsOnComplete'), lang.hitch(this, 'viewZipsOnError'));
// class member function 'viewZipsOnComplete' will recive array of results.
```
##### Notes:
Use an array or object:
```javascript
require(["dojo/promise/all"], function(all){

  all([promise1, promise2]).then(function(results){
    // results will be an Array
  });

  // -- or --

  all({
    promise1: promise1,
    promise2: promise2
  }).then(function(results){
    // results will be an Object using the keys "promise1" and "promise2"
  });

});
```

[`dojo/store/Memory`](http://dojotoolkit.org/reference-guide/1.10/dojo/store/Memory.html)
-------------------
Dojo store基于HTML5 IndexedDB object store API，旨在简化store的构建与查询以及不同store间的交互。
memory是个非常有效率的常驻内存的store，只要提供一个数组就可以创建。
memory本身也拥有方便的查询与排序功能，可以方便的查找数据，对数据进行排序处理。
```javascript
require(["dojo/store/Memory"], function(Memory){
    var someData = [
        {id:1, name:"One"},
        {id:2, name:"Two"}
    ];
    store = new Memory({data: someData});

    store.get(1) -> Returns the object with an id of 1

    store.query({name:"One"}) // Returns query results from the array that match the given query

    store.query(function(object){
        return object.id > 1;
    }) // Pass a function to do more complex querying

    store.query({name:"One"}, {sort: [{attribute: "id"}]}) // Returns query results and sort by id

    store.put({id:3, name:"Three"}); // store the object with the given identity

    store.remove(3); // delete the object
});
```

[`dgrid`](http://dojofoundation.org/packages/dgrid/)
--------------
易扩展的grid控件。
```javascript
this.dgrid = new(declare([Grid]))({
  //selectionMode: "single",
  bufferRows: Infinity,
  columns: [{
    label: "Type",
    field: "type",
    sortable: true
  }, {
    label: "Truck",
    field: "label",
    sortable: true
  }, {
    label: "Last Report",
    field: "date",
    sortable: true,
    formatter: function(value) {
      return new Date(value).toLocaleString();
    }
  }]
}, 'truckGrid');
this.dgrid.startup();

var trucks = array.map(this.lastKnown.graphics, function(g) {
  return g.attributes;
});
this.deviceStore = new Memory({
  data: trucks
});
this.dgrid.set("store", this.deviceStore);
```

[`gridx`](https://github.com/oria/gridx/)
--------------
[主页](http://oria.github.io/gridx/)
使用方法，参考[如何使用 Gridx](http://www.ibm.com/developerworks/cn/web/1302_zhuxw_gridx/)
```javascript
require([
  "gridx/Grid",
  "gridx/core/model/cache/Sync",
  //......
  "dojo/domReady!"
], function(Gridx, Cache, ......){
  //......
  var grid = new Gridx({
    cacheClass: Cache
      store: store,
      //......
  });
  grid.placeAt('gridContainerNode');
  grid.startup();
});
```

[`dbind`](https://github.com/kriszyp/dbind)
--------------
dbind is a functional reactive data binding package that provides straightforward binding of data to components like form inputs, validation connectors, and more. The dbind framework is designed to help you create organized, well-structured, layered applications, facilitating a clean separation between a data model with validation logic and presentation elements. It is also intended to be compatible with Dojo and bindr, giving you the full capabilities of the bindr reactive data binding language with Dojo and Dijit widgets.
```javascript
require(['dbind/bind'], function(bind){
    bind(anInputElement).to(myObject, "propertyName");
    //see output realtime:
    bind(myDiv).to(myObject, 'propertyName');
});
```
For dijits:
```javascript
require(['dijit/form/TextBox', 'dbind/bind'], function(TextBox){
    var textBox = new TextBox({}, 'textbox');
    bind(textBox).to(myProperty);
});
```

[`dojo/on`](http://dojotoolkit.org/reference-guide/1.10/dojo/on.html)
--------------
基于现代浏览器的事件模型的，DOM节点事件绑定与监听的方法
```javascript
require(["dojo/on"], function(on){
  on(target, "event", function(e){
    // handle event
  });

  on.emit(target, "event", {
    bubbles: true,
    cancelable: true
  });
});
```

--------------
Dojo DOM的操作函数集
--------------

[`dojo/query`](http://dojotoolkit.org/reference-guide/1.10/dojo/)
--------------
query： DOM节点查询。

[`dojo/dom`](http://dojotoolkit.org/reference-guide/1.10/dojo/)
--------------
dom：DOM节点的查询。
方法包括：byId()，isDescendant()，setSelectable()。

[`dojo/dom-class`](http://dojotoolkit.org/reference-guide/1.10/dojo/dom-class.html#dojo-dom-class)
--------------
dom-class：操作DOM节点的class。
方法包括：contains()，add()， remove()， replace()， toggle()。

[`dojo/dom-style`](http://dojotoolkit.org/reference-guide/1.10/dojo/)
--------------
dom-style：操作DOM节点的css属性。
方法包括：set()，get()，getComputedStyle()。

[`dojo/dom-construct`](http://dojotoolkit.org/reference-guide/1.10/dojo/)
--------------
dom-construct：操作DOM节点。
方法包括：toDom()，create()，empty()，place()，replace()，destroy()。

[`dojo/dom-attr`](http://dojotoolkit.org/reference-guide/1.10/dojo/)
--------------
dom-attr：操作DOM节点的属性。
方法包括：set()， get(http://dojotoolkit.org/reference-guide/1.10/dojo/)

[`dojo/dom-geometry`](http://dojotoolkit.org/reference-guide/1.10/dojo/)
--------------
dom-geometry：操作DOM节点的位置属性。
方法包括：position()，getMarginBox()，setMarginBox()，getContentBox()，setContentSize()等。
```javascript
require([
  "dojo/dom",
  "dojo/query",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-style",
  "dojo/dom-geometry",
  "dojo/dom-construct"
],function(dom, query, domAttr, domClass, domStyle, domGeom, domConstruct){
  var node = dom.byId("node"); // 查找id为node的节点
  query(".node li").forEach(function(li){
    var span = domConstruct.create("span",{
      "class": "red",
      innerHTML: "red"
    },li); // 为每个li标签添加span标签
    domClass.contains(span,"red"); // 判断span是否有名字为red的class
    domClass.toggle(span,"active") // 添加或删除active class
    domStyle.set(span,{
      width: "100px",
      height: "60px",
      top: 0,
      left: 0
    }); // 设置span的宽和高
    domAttr(span,"class"); // 返回red、active，获取span的class属性。
    domGeom.getMarginBox(span); // {l:0,t:0,w:100,h:60}
  },this) // 查询class为node的所有li标签
});
```

[`dojo/aspect`](http://dojotoolkit.org/reference-guide/1.10/dojo/aspect.html)
--------------
Dojo的面向方面编程（AOP）[面向方面编程（AOP）功能与原理](http://www.infoq.com/cn/articles/zwb-dojo-aop)

[`dojo/_base/declare`](http://dojotoolkit.org/reference-guide/1.9/dojo/_base/declare.html)
--------------
用于声明dojo类，支持单继承，多模块嵌入。

```javascript
require([
  "dojo/on",
  "dojo/aspect",
  "dojo/_base/lang",
  "dojo/_base/declare"
],function(on, aspect, lang, declare){
  var A = declare(null,{
    hello: "您好：",
    name: null,
    constructor: function(args){
      lang.mixin(this, args);
      this.greeting = this.hello + this.name;
    },

    say: function(){
      console.log(this.greeting);
    },

    sayAgain: function(){
      aspect.after(this,"say",lang.hitch(this,function(){
        console.log("再来一次："+ this.greeting);
      }));
    }
  });

  var B = declare(null,{
    something: "打招呼",
    doSomething: function(){
      console.log(this.something);
    }
  });

  var C = declare([A,B],{

  });

  a = new A({name:"小小"});
  a.sayAgain();
  a.say();
  // 您好：小小
  // 再来一次：您好：小小
  //
  var c = new C({name:"笑笑"});
  c.doSomething(); // 打招呼
  c.say(); // 您好：笑笑
});
```

[`dojo/Stateful`](http://dojotoolkit.org/reference-guide/1.10/dojo/Stateful.html)
--------------
为对象提供getter/setter方法。以及提供监听属性更改的方法。
```javascript
require(["dojo/Stateful", "dojo/_base/declare"], function(Stateful, declare){
  // Subclass dojo/Stateful:
  var MyClass = declare([Stateful], {
    foo: null,
    _fooGetter: function(){
      return this.foo;
    },
    _fooSetter: function(value){
      this.foo = value;
    }
  });

  // Create an instance and set some initial property values:
  myObj = new MyClass({
    foo: "baz"
  });

  // Watch changes on a property:
  myObj.watch("foo", function(name, oldValue, value){
    // Do something based on the change
  });

  // Get the value of a property:
  myObj.get("foo");

  // Set the value of a property:
  myObj.set("foo", "bar");
});
```

[`dojo/Evented`](http://dojotoolkit.org/reference-guide/1.9/dojo/Evented.html)
--------------
dojo/Evented is a module that provides a class that can be used as a base class or mixin for JavaScript classes that emit their own events. dojo/Evented is designed to provide a class that allows a developer to emit events and provide an easy way to allow those events to be connected to by downstream users. It leverages the API concepts of :ref:dojo/on <dojo/on>. It should be noted though that this is for what is commonly referred to as “sythetic” events, which are different than DOM events, which dojo/on normalises.
```javascript
define(["dojo/Evented", "dojo/_base/declare"], function(Evented, declare){
  var MyComponent = declare([Evented], {
    startup: function(){
      // once we are done with startup, fire the "ready" event
      this.emit("ready", {});
    }
  });

  component = new MyComponent();
  component.on("ready", function(){
    // this will be called when the "ready" event is emitted
    // ...
  });
  component.startup();
});
```
