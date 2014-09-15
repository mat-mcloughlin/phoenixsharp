/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        AppInit = brackets.getModule("utils/AppInit"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    var omniserver = new NodeDomain("omniserver", ExtensionUtils.getModulePath(module, "node/omniserver"));

    var mycallback = function (err, data) {

    };

    function logMemory() {
        omniserver.exec("getMemory")
            .done(function (memory) {
                console.log(memory);
                //                console.log(
                //                    "[brackets-simple-node] Memory: %d bytes free",
                //                    memory
                //                );
            }).fail(function (err) {
                console.error("[brackets-simple-node] failed to run simple.getMemory", err);
            });
    }



    // Log memory when extension is loaded
    logMemory();

    // Function to run when the menu item is clicked
    function handleHelloWorld() {
        window.alert("Hello, world!");
    }

    function Intellisense() {
        this.exclusion = null;
    }

    Intellisense.prototype.hasHints = function (editor, implicitChar) {
        var pos = editor.getCursorPos();

        //this.tagInfo = HTMLUtils.getTagInfo(editor, pos);
        this.editor = editor;
        //        if (implicitChar === null) {
        //            if (this.tagInfo.position.tokenType === HTMLUtils.TAG_NAME) {
        //                if (this.tagInfo.position.offset >= 0) {
        //                    if (this.tagInfo.position.offset === 0) {
        //                        this.exclusion = this.tagInfo.tagName;
        //                    } else {
        //                        this.updateExclusion();
        //                    }
        //                    return true;
        //                }
        //            }
        //            return false;
        //        } else {
        //            if (implicitChar === "<") {
        //                this.exclusion = this.tagInfo.tagName;
        //                return true;
        //            }
        //            return false;
        //        }

        return true;
    };

    Intellisense.prototype.getHints = function (implicitChar) {
        //        var query,
        //            result;
        //
        //        this.tagInfo = HTMLUtils.getTagInfo(this.editor, this.editor.getCursorPos());
        //        if (this.tagInfo.position.tokenType === HTMLUtils.TAG_NAME) {
        //            if (this.tagInfo.position.offset >= 0) {
        //                this.updateExclusion();
        //                query = this.tagInfo.tagName.slice(0, this.tagInfo.position.offset);
        //                result = $.map(tags, function (value, key) {
        //                    if (key.indexOf(query) === 0) {
        //                        return key;
        //                    }
        //                }).sort();
        //
        //                return {
        //                    hints: result,
        //                    match: query,
        //                    selectInitial: true,
        //                    handleWideResults: false
        //                };
        //            }
        //        }
        //
        //        return null;
        return {
            hints: ['Clone', 'IndexOf', 'Replace'],
            match: null,
            selectInitial: true,
            handleWideResults: false
        };
    };

    Intellisense.prototype.insertHint = function (completion) {
        var start = {
                line: -1,
                ch: -1
            },
            end = {
                line: -1,
                ch: -1
            },
            cursor = this.editor.getCursorPos(),
            charCount = 0;

        //        if (this.tagInfo.position.tokenType === HTMLUtils.TAG_NAME) {
        //            var textAfterCursor = this.tagInfo.tagName.substr(this.tagInfo.position.offset);
        //            if (CodeHintManager.hasValidExclusion(this.exclusion, textAfterCursor)) {
        //                charCount = this.tagInfo.position.offset;
        //            } else {
        //                charCount = this.tagInfo.tagName.length;
        //            }
        //        }
        //
        //        end.line = start.line = cursor.line;
        //        start.ch = cursor.ch - this.tagInfo.position.offset;
        //        end.ch = start.ch + charCount;
        //
        //        if (this.exclusion || completion !== this.tagInfo.tagName) {
        //            if (start.ch !== end.ch) {
        //                this.editor.document.replaceRange(completion, start, end);
        //            } else {
        //                this.editor.document.replaceRange(completion, start);
        //            }
        //            this.exclusion = null;
        //        }
        this.editor.document.replaceRange(completion, start);
        this.exclusion = null;
        return false;
    };

    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "helloworld.sayhello"; // package-style naming to avoid collisions
    CommandManager.register("Hello World", MY_COMMAND_ID, handleHelloWorld);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    //var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    //menu.addMenuItem(MY_COMMAND_ID);

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)

    AppInit.appReady(function () {
        // Register code hint providers
        var intellisense = new Intellisense();

        CodeHintManager.registerHintProvider(intellisense, ["csharp"], 0);

        // For unit testing
        exports.intellisenseProvider = intellisense;
        //exports.attrHintProvider = attrHints;
    });
});