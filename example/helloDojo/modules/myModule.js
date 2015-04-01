define([
    "dojo/on",
    "dojo/aspect",
    "dojo/_base/lang",
    "dojo/_base/declare"
], function(on, aspect, lang, declare) {
    var A = declare(null, {
        hello: "您好：",
        name: null,
        constructor: function(args) {
            lang.mixin(this, args);
            this.greeting = this.hello + this.name;
        },

        say: function() {
            console.log(this.greeting);
        },

        sayAgain: function() {
            aspect.after(this, "say", lang.hitch(this, function() {
                console.log("再来一次：" + this.greeting);
            }));
        }
    });

    var B = declare(null, {
        something: "打招呼",
        hello: "222222",
        doSomething: function() {
            console.log(this.something);
        },
        say: function() {
            console.log(11111);
        }
    });

    var C = declare([A, B], {

    });

    return {
        start: function() {
            a = new A({
                name: "小小"
            });
            // a.sayAgain();
            // a.say();
            // 您好：小小
            // 再来一次：您好：小小
            //
            var c = new C({
                name: "笑笑"
            });
            c.doSomething(); // 打招呼
            c.sayAgain();
            c.say(); // 您好：笑笑
        }
    };
});
