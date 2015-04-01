require([
    'm/MyDojo',
    'dojo/dom',
    'dojo/fx',
    'dojo/domReady!'
], function(MyDojo, dom, fx) {
    // The piece we had before...
    var greeting = dom.byId('greeting');
    greeting.innerHTML += ' from Dojo!';
    var myDojo = new MyDojo();

    // ...but now, with an animation!
    fx.slideTo({
        node: greeting,
        top: 100,
        left: 200
    }).play();

    myDojo.setText('greeting', 'Hello Dojo!');

    setTimeout(function() {
        myDojo.restoreText('greeting');
        myDojo.createMyDom('node');
        myDojo.testModule();
    }, 3000);
});
