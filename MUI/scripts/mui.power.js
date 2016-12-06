(function ($) {
    jQuery(document).ajaxError(function (event, XMLHttpRequest, ajaxOptions, thrownError) {
        if (XMLHttpRequest.status != 0) {
            console.log('-----------------异步错误-----------------')
            console.log(XMLHttpRequest);
            console.log(ajaxOptions)

            html = '抱歉，系统出了一个问题\r\n请联系管理员查看异常日志。\r\n请求地址:' +
                ajaxOptions.url + '\r\n错误代码:' +
                XMLHttpRequest.status + '\r\n请求类型:' +
                ajaxOptions.type + '\r\n数据类型:' +
                (ajaxOptions.dataType ? ajaxOptions.dataType : ajaxOptions.dataTypes) + '\r\n手机系统:' +
                (mui.os.android ? "android" : "ios") + "(" + mui.os.version + ")" + "\r\nAPP版本:" +
                (plus ? plus.runtime.version : "");

            console.log(html);
            console.log('-----------------异步错误-----------------')

            mui.alert(html, '错误信息');
        }
    })

    $.powerData = {};
    $.angular = {};
    $.extend($.powerData, {
        rootUrl: 'http://www.5imvc.com/',
        backButtonPress: 0,
        rows:15,
        initBackClose: function () {
            mui.back = function (event) {
                mui.powerData.backButtonPress++;
                if (mui.powerData.backButtonPress > 1) {
                    plus.runtime.quit();
                } else {
                    plus.nativeUI.toast('再按一次退出应用');
                }
                setTimeout(function () {
                    mui.powerData.backButtonPress = 0;
                }, 1000);
                return false;
            };
        }
    })

    $.extend($.powerData, {
        url: $.powerData.rootUrl + 'mui/',
    })

    $.extend($, {
        goHome: function (type) {
            plus.webview.close(plus.webview.currentWebview().id)
            if (type === "index") {
                $.openWindow({
                    id: "main",
                    url: "Index.html"
                })
            }
        },
        setSettings: function (settings) {
            settings = settings || {};
            localStorage.setItem('$settings', JSON.stringify(settings));
        },
        getSettings: function () {
            var settingsText = localStorage.getItem('$settings') || "{}";
            return JSON.parse(settingsText);
        }
    })

    $.extend($.angular, {
        initApp: function (htmApp, a_options) {
            var directives = a_options.directives;
            if (directives.indexOf("ngTap") !== -1) {
                htmApp.directive("ngTap", function () {
                    return function (scope, element, attributes) {
                        element.on("tap", function (t) {
                            scope.tapElement = element;
                            scope.$apply(attributes["ngTap"]);
                        });
                    }
                });
            }

            if (directives.indexOf("ngPicker") !== -1) {
                htmApp.directive('ngPicker', function () {
                    return function (scope, element, attributes) {
                        element.on("tap", function (t) {
                            //scope.$apply(attributes["ngTap"]);
                            var optionsJson = attributes["ngPicker"] || '{}';
                            var options = JSON.parse(optionsJson);

                            if (options.disable)
                                return;

                            var id = this.getAttribute('id');
                            options['value'] = t.target.value;
                            /*
							 * 首次显示时实例化组件
							 * 示例为了简洁，将 options 放在了按钮的 dom 上
							 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
							 */
                            var picker = new mui.DtPicker(options);
                            picker.show(function (rs) {
                                var modelText = attributes["ngModel"];
                                var attrs;
                                if (modelText) {
                                    attrs = attributes["ngModel"].split(".")
                                } else {
                                    attrs = options.model.split(".");
                                    t.target.value = rs.value;
                                }

                                var scopeVal = scope[attrs[0]];
                                scopeVal[attrs[1]] = rs.value
                                scope.$apply()
                            });
                        });
                    }
                });
            }

            var filters = a_options.filters;
            if (filters) {
                if (filters.indexOf("newLines") !== -1) {
                    htmApp.filter('newLines', function () {
                        return function (text) {
                            if (text)
                                return text.replace(/\n/g, '<br/>');
                            else
                                return text;
                        }
                    });
                }
            }

            return htmApp;
        }
    })

})(mui)