Angular-On-Screen-Keyboard
===================

An on screen keyboard that's always present. Fully customizable layout and easy to use API.
Perfect for applications on touch devices as an alternative to the default on screen keyboard.  

Web site: [https://github.com/GreenfieldVentures/angular-on-screen-keyboard](https://github.com/GreenfieldVentures/angular-on-screen-keyboard)

License: MIT License

Simple demos: [http://rawgit.com/GreenfieldVentures/angular-on-screen-keyboard/master/index.html](http://rawgit.com/GreenfieldVentures/angular-on-screen-keyboard/master/index.html)


Installation
------------

    bower install angular-on-screen-keyboard
    
or

    npm install angular-on-screen-keyboard


Usage
-----

1. Include the minified js and css files in your markup

2. Register the module in your angular app
```js
angular.module('myAngularApp', ['onScreenKeyboard']);
```

3. Add the ```html <on-screen-keyboard></on-screen-keyboard>``` tag in your markup

API (optional)
--------------
* `rows` - The plugin comes with a predefined keyboard. It can easily be overridden by supplying an arrays of keys on the rows attribute.
    * A regular key is specified as the character it represents, i.e. 'i', 'p', '5', etc.
    * Keys can also be specified in more detail by passing an object instead of a char. Examples can be seen in [Demo 2] and [Demo 3]
        * `colspan` - Specifies how wide, in number of keys, the key will be. Default: 1
        * `text` - The text on the key and thereby the value the pressed key will send to the currently selected input field
        * `type` - Specifies the type of key. The value will be set as an additional class name on the key's element, though some reserved names will give the key extra powers such as 'margin', 'erase' and 'shift 
    * To specifify an empty space instead of a key, for layout purposes, by adding an object with the type set to margin: ```js {type: 'margin'}``` in the array
* `uppercase-all-words` - By specifying this attribute the keyboard will be set to uppercase before entering the first letter of every new word

[Demo 2]: http://rawgit.com/GreenfieldVentures/angular-on-screen-keyboard/master/demo2.html
[Demo 3]: http://rawgit.com/GreenfieldVentures/angular-on-screen-keyboard/master/demo3.html
