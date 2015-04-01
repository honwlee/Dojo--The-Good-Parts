这是来自dojotoolkit的文档译文，[查看原文](http://dojotoolkit.org/documentation/tutorials/1.10/hello_dojo/)

欢迎来到Dojo世界，本篇将为你介绍：如何使用Dojo，以及关于Dojo的一些基本核心功能。

开始：
---

只需要将dojo.js作为脚本引入到你的web页面就可以正常使用dojo提供的功能。

dojo遵循[Asynchronous Module Definition - AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)格式。 采用AMD的原因是因为它是纯Javascript, 支持浏览器，在应用程序部属时，支持 build工具对资源进行优化。

dojo.js是一个AMD加载器，定义了两个全局函数：require（加载及使用模块）和define（定义模块）。

