'use strict';
angular.module('onScreenKeyboard', ['ngSanitize'])
    .directive('onScreenKeyboard', function ($timeout) {
        return {
            restrict: 'E',
            bindToController: true,
            controllerAs: 'ctrl',
            scope: {
                //rows : '@'
            },
            controller: function($sce){
                var ctrl = this;

                if (!ctrl.rows){
                    ctrl.rows = [
                        ['1', '2', '3', '4','5','6','7','8', '9', '0', {type: 'erase', colspan: 2, text: '&lArr;'}],
                        ['q','w','e','r','t','y','u','i','o','p','å','@'],
                        ['a','s','d','f','g','h','j','k','l','ö','ä', {type: 'margin'}],
                        [{type: 'shift'}, 'z','x','c','v','b','n','m','.','-','_',{type: 'shift'}],
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
                }
            },
            link: function (scope, element) {
                var ctrl = scope.ctrl;

                element.bind('contextmenu', function () {
                    event.preventDefault();
                    return false;
                });

                ctrl.isUpperCase = false;
                ctrl.lastInputCtrl;
                ctrl.startPos;
                ctrl.endPos;

                ctrl.printKeyStroke = function(){
                    if (!ctrl.lastInputCtrl)
                        return;

                    var e = $(event.srcElement);

                    if (e.hasClass('erase')){
                        ctrl.eraseKeyStroke();
                        return;
                    } else if (e.hasClass('shift')){
                        ctrl.inverseCase();
                        return;
                    }


                    var val = $(ctrl.lastInputCtrl).val();
                    var pre = val.substring(0, ctrl.startPos);
                    var post = val.substring(ctrl.endPos, val.length);
                    var l = $(ctrl.lastInputCtrl);
                    l.val(pre + e.text() + post);
                    angular.element(l).triggerHandler('change');
                    ctrl.startPos++;
                    ctrl.endPos++;
                    ctrl.setKeyboardLayout();
                };

                ctrl.inverseCase = function(){
                    var letters = $(element).find('.letter');
                    angular.forEach(letters, function (x) {
                        if (!ctrl.isUpperCase)
                            $(x).text($(x).text().toString().toUpperCase());
                        else
                            $(x).text($(x).text().toString().toLowerCase());
                    });

                    if (ctrl.isUpperCase)
                        $(element).find('.shift').html('&dArr;');
                    else
                        $(element).find('.shift').html('&uArr;');

                    ctrl.isUpperCase = !ctrl.isUpperCase;
                }

                ctrl.refocus = function () {
                    $(ctrl.lastInputCtrl).focus();
                }

                ctrl.eraseKeyStroke = function () {
                    if (!ctrl.lastInputCtrl)
                        return;

                    var hasSel = ctrl.startPos !== ctrl.endPos;

                    var val = $(ctrl.lastInputCtrl).val();
                    var pre = val.substring(0, hasSel ? ctrl.startPos : ctrl.startPos - 1);
                    var post = val.substring(ctrl.endPos, val.length);

                    $(ctrl.lastInputCtrl).val(pre + post);
                    var l = $(ctrl.lastInputCtrl);
                    angular.element(l).triggerHandler('change');

                    if (hasSel) {
                        ctrl.endPos = ctrl.startPos;
                    }
                    else {
                        ctrl.startPos--;
                        ctrl.endPos--;
                    }
                    ctrl.setKeyboardLayout();
                    ctrl.refocus();
                };

                ctrl.setKeyboardLayout = function () {
                    if (!ctrl.lastInputCtrl){
                        ctrl.isUpperCase = false;
                        ctrl.inverseCase();
                        return;
                    }
                    else if (ctrl.lastInputCtrl.className && ctrl.lastInputCtrl.className.indexOf("nocaps") != -1 && ctrl.isUpperCase)
                        ctrl.inverseCase();
                    else if ($(ctrl.lastInputCtrl).val().length === 0) {
                        if (!ctrl.isUpperCase) {
                            ctrl.isUpperCase = false;
                            ctrl.inverseCase();
                        }
                    }
                    else{
                        ctrl.isUpperCase = true;
                        ctrl.inverseCase();
                    }

                    ctrl.lastInputCtrl.selectionStart = ctrl.startPos;
                    ctrl.lastInputCtrl.selectionEnd = ctrl.startPos;
                };

                $('input, textarea')
                    .bind('blur', function () {
                        ctrl.setKeyboardLayout();

                        ctrl.lastInputCtrl = this;
                        if (ctrl.lastInputCtrl && ctrl.lastInputCtrl.type != "checkbox") {
                            ctrl.startPos = ctrl.lastInputCtrl.selectionStart;
                            ctrl.endPos = ctrl.lastInputCtrl.selectionEnd;
                        }
                    })
                    .bind('keydown', function(){
                        $timeout(function(){
                        ctrl.setKeyboardLayout();
                        },0);
                    })

                $timeout(function(){
                    ctrl.inverseCase();
                },0);
            },
            templateUrl: '/templates/angular-on-screen-keyboard.html'
        };
    });