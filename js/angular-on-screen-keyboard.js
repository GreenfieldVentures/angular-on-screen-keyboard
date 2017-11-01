/* global angular:false */
angular.module('onScreenKeyboard', ['ngSanitize'])
    .directive('onScreenKeyboard', function ($timeout, $document) {
      'use strict';
      
        return {
            restrict: 'E',
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {
                rows : '=?',
                uppercaseAllWords : '@',
            },
            controller: function($sce){
                var ctrl = this;

                if (!ctrl.rows){
                    ctrl.rows = [
                        ['1', '2', '3', '4','5','6','7','8', '9', '0', {type: 'erase', colspan: 2, text: '&lArr;'}],
                        ['q','w','e','r','t','y','u','i','o','p','@'],
                        ['a','s','d','f','g','h','j','k','l','-','_', {type: 'margin'}],
                        [{type: 'shift', upperCase: '&dArr;', lowerCase: '&uArr;'}, 'z','x','c','v','b','n','m',',', '.',{type: 'shift', upperCase: '&dArr;', lowerCase: '&uArr;'}],
                        [{type: 'margin'}, {type: 'space', colspan: 9, text: ' '}]
                    ];
                }

                ctrl.getText = function(key){
                    if (key.type === 'margin')
                        return '';

                    var val = '';

                    if (key.text)
                        val = key.text;
                    else  if (key.lowerCase && !ctrl.isUpperCase)
                        val = key.lowerCase;
                    else  if (key.upperCase && ctrl.isUpperCase)
                        val = key.upperCase;
                    else {
                        val = ctrl.isUpperCase ? key.toUpperCase() : key.toLowerCase();
                    }

                    if (val && val.indexOf('&') > -1)
                        return $sce.trustAsHtml(val);

                    return val;
                };
            },
            link: function (scope, element, attr) {
                var ctrl = scope.ctrl;
                ctrl.isUpperCase = false;
                ctrl.lastInputCtrl = null;
                ctrl.startPos = null;
                ctrl.endPos = null;

                ctrl.printKeyStroke = function(key, event){
                    if (!ctrl.lastInputCtrl)
                        return;

                    ctrl.startPos = ctrl.lastInputCtrl.selectionStart;
                    ctrl.endPos = ctrl.lastInputCtrl.selectionEnd;

                    if (key.type === 'erase'){
                        ctrl.eraseKeyStroke();
                        return;
                    } else if (key.type === 'shift'){
                        ctrl.isUpperCase = !ctrl.isUpperCase;
                        return;
                    }

                    var htmlKeyVal = angular.element(event.target || event.srcElement).text();
                    var lastInputCtrl = angular.element(ctrl.lastInputCtrl);
                    var val = lastInputCtrl.val();
                    var pre = val.substring(0, ctrl.startPos);
                    var post = val.substring(ctrl.endPos, val.length);
                    lastInputCtrl.val(pre + htmlKeyVal + post);
                    lastInputCtrl.triggerHandler('change');

                    ctrl.startPos += htmlKeyVal.length;
                    ctrl.endPos += htmlKeyVal.length;
                    ctrl.lastInputCtrl.selectionStart = ctrl.startPos;
                    ctrl.lastInputCtrl.selectionEnd = ctrl.startPos;
                    ctrl.setKeyboardLayout();
                    ctrl.refocus();
                };

                ctrl.refocus = function () {
                    ctrl.lastInputCtrl.focus();
                };

                ctrl.eraseKeyStroke = function () {
                    if (!ctrl.lastInputCtrl)
                        return;

                    var hasSel = ctrl.startPos !== ctrl.endPos;

                    var lastInputCtrl = angular.element(ctrl.lastInputCtrl);
                    var val = lastInputCtrl.val();
                    var pre = val.substring(0, hasSel ? ctrl.startPos : ctrl.startPos - 1);
                    var post = val.substring(ctrl.endPos, val.length);

                    lastInputCtrl.val(pre + post);
                    lastInputCtrl.triggerHandler('change');

                    if (hasSel) {
                        ctrl.endPos = ctrl.startPos;
                    }
                    else {
                        ctrl.startPos--;
                        ctrl.endPos--;
                    }
                    ctrl.lastInputCtrl.selectionStart = ctrl.startPos;
                    ctrl.lastInputCtrl.selectionEnd = ctrl.startPos;
                    ctrl.setKeyboardLayout();
                    ctrl.refocus();
                };

                ctrl.setKeyboardLayout = function () {
                    if (!ctrl.lastInputCtrl){
                        ctrl.isUpperCase = true;
                        return;
                    }
                    else if (ctrl.lastInputCtrl.className && ctrl.isUpperCase)
                        ctrl.isUpperCase = false;
                    else if (angular.element(ctrl.lastInputCtrl).val().length === 0) {
                        ctrl.isUpperCase = true;
                    }
                    else if (angular.element(ctrl.lastInputCtrl).val().slice(-1) === ' ' && !ctrl.isUpperCase && attr.uppercaseAllWords !== undefined)
                        ctrl.isUpperCase = true;
                    else{
                        ctrl.isUpperCase = false;
                    }
                };

                var focusin = function(event){
                    var e = event.target || event.srcElement;

                    if (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA') {
                        ctrl.lastInputCtrl = e;
                        ctrl.setKeyboardLayout();
                    }
                };

                var keyup = function(){
                    if (!ctrl.lastInputCtrl)
                        return;

                    ctrl.startPos = ctrl.lastInputCtrl.selectionStart;
                    ctrl.endPos = ctrl.lastInputCtrl.selectionEnd;

                    ctrl.setKeyboardLayout();
                    scope.$digest();
                };

                $document.bind('focusin', focusin);
                $document.bind('keyup', keyup);

                scope.$on("$destroy", function() {
                    $document.unbind('focusin', focusin);
                    $document.unbind('keyup', keyup);
                });

                element.bind('contextmenu', function (event) {
                    event.preventDefault();
                    return false;
                });

                $timeout(function(){
                    ctrl.isUpperCase = true;
                },0);
            },
            templateUrl: '/templates/angular-on-screen-keyboard.html'
        };
    });
