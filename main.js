/* 
 *Copyright (C) 2012 Thomas Andersen. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 *
 */



/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    'use strict';

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
 		ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    ExtensionUtils.loadStyleSheet(module, "styles.css");

	function MatchTrailingSpaceHighlightState() {
		this.marked = [];
	}

	function getMatchHighlightState(cm) {
		return cm._matchTrailingSpaceHighlightState || (cm._matchTrailingSpaceHighlightState = new MatchTrailingSpaceHighlightState());
	}
  
	function clearMarks(cm) {
		var state = getMatchHighlightState(cm);
		for (var i = 0; i < state.marked.length; ++i) {
			state.marked[i].clear();
		}
		state.marked = [];
	}

	function doHighlightTrailingSpaces(cm) {
		clearMarks(cm);
		var state = getMatchHighlightState(cm);
		var queryRegExp = / +$/;
	  	cm.operation(function() {
	  		//This is too expensive on big documents.
			if (cm.lineCount() < 2000) {
				for (var cursor = cm.getSearchCursor(queryRegExp); cursor.findNext();) {
					state.marked.push(cm.markText(cursor.from(), cursor.to(), 'CodeMirror-trailingspace'));
				}
			}
		});
  	}

    function highlightTrailingSpaces() {
		var editor = EditorManager.getCurrentFullEditor();
		if (editor) {
			doHighlightTrailingSpaces(editor._codeMirror);
		}
    }

    function handleTrailingSpaces() {
    	highlightTrailingSpaces();
    }

    var MY_COMMAND_ID = "trailingspaces.show";   // package-style naming to avoid collisions
    CommandManager.register("Show Trailing Spaces", MY_COMMAND_ID, handleTrailingSpaces);

    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(MY_COMMAND_ID);
    
    // TODO: Press escape to clear marks
});
