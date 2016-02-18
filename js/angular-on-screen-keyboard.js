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
                        [{type: 'shift'}, 'z','x','c','v','b','n','m',',', '.',{type: 'shift'}],
                        [{type: 'margin'}, {type: 'space', colspan: 9, text: ' '}]
                    ];
                }

                ctrl.getText = function(key){
                    if (key.type === 'margin')
                        return '';
                    else if (key.type === 'shift')
                        return '&dArr;';

                    var val = key.text || key;

                    if (val && val.indexOf('&') > -1)
                        return $sce.trustAsHtml(val);

                    return val;
                };
            },
            link: function (scope, element, attr) {
                var ctrl = scope.ctrl;

                element.bind('contextmenu', function (event) {
                    event.preventDefault();
                    return false;
                });

                ctrl.isUpperCase = false;
                ctrl.lastInputCtrl = null;
                ctrl.startPos = null;
                ctrl.endPos = null;

                ctrl.printKeyStroke = function(event){
                    if (!ctrl.lastInputCtrl)
                        return;

                    var e = angular.element(event.target || event.srcElement);

                    if (e.hasClass('erase')){
                        ctrl.eraseKeyStroke();
                        return;
                    } else if (e.hasClass('shift')){
                        ctrl.inverseCase();
                        return;
                    }


                    var lastInputCtrl = angular.element(ctrl.lastInputCtrl);
                    var val = lastInputCtrl.val();
                    var pre = val.substring(0, ctrl.startPos);
                    var post = val.substring(ctrl.endPos, val.length);
                    lastInputCtrl.val(pre + e.text() + post);
                    lastInputCtrl.triggerHandler('change');
                    ctrl.startPos++;
                    ctrl.endPos++;
                    ctrl.setKeyboardLayout();
                };

                ctrl.inverseCase = function(){
                    var letters = element[0].querySelectorAll('.letter');
                    angular.forEach(letters, function (x) {
                        var em = angular.element(x);
                        if (!ctrl.isUpperCase)
                            em.text(em.text().toString().toUpperCase());
                        else
                            em.text(em.text().toString().toLowerCase());
                    });

                    angular.forEach(element[0].querySelectorAll('.shift'), function(shift){
                        if (ctrl.isUpperCase)
                            angular.element(shift).html('&dArr;');
                        else
                            angular.element(shift).html('&uArr;');
                    });

                    ctrl.isUpperCase = !ctrl.isUpperCase;
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
                        ctrl.isUpperCase = false;
                        ctrl.inverseCase();
                        return;
                    }
                    else if (ctrl.lastInputCtrl.className && ctrl.isUpperCase)
                        ctrl.inverseCase();
                    else if (angular.element(ctrl.lastInputCtrl).val().length === 0) {
                        if (!ctrl.isUpperCase) {
                            ctrl.isUpperCase = false;
                            ctrl.inverseCase();
                        }
                    }
                    else if (angular.element(ctrl.lastInputCtrl).val().slice(-1) === ' ' && !ctrl.isUpperCase && attr.hasOwnProperty('uppercaseAllWords'))
                        ctrl.inverseCase();
                    else{
                        ctrl.isUpperCase = true;
                        ctrl.inverseCase();
                    }
                };

                $document.find('input')
                    .bind('blur focus', function () {
                        ctrl.setKeyboardLayout();

                        ctrl.lastInputCtrl = this;
                        if (ctrl.lastInputCtrl && ctrl.lastInputCtrl.type != "checkbox") {
                            ctrl.startPos = ctrl.lastInputCtrl.selectionStart;
                            ctrl.endPos = ctrl.lastInputCtrl.selectionEnd;
                        }
                    })
                    .bind('keydown', function(){
                        if(!ctrl.lastInputCtrl)
                            return;

                        ctrl.startPos = ctrl.lastInputCtrl.selectionStart;
                        ctrl.endPos = ctrl.lastInputCtrl.selectionEnd;
                    });

                $timeout(function(){
                    ctrl.inverseCase();
                },0);
            },
            templateUrl: '/templates/angular-on-screen-keyboard.html'
        };
    });
