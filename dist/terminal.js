// Generated by Haxe 3.4.7
(function ($hx_exports) { "use strict";
var terminaljs_Terminal = $hx_exports["Terminal"] = function(id) {
	this._cursorBlinkRate = 500;
	this._preCursor = "";
	this._shouldBlinkCursor = true;
	this._input = window.document.createElement("p");
	this._cursor = window.document.createElement("span");
	this._inputLine = window.document.createElement("span");
	this._inputLinePre = window.document.createElement("span");
	this._output = window.document.createElement("p");
	this._innerWindow = window.document.createElement("div");
	this.html = window.document.createElement("div");
	this.html.className = "Terminal";
	if(id != null) {
		this.html.id = id;
	}
	this._input.appendChild(this._inputLinePre);
	this._input.appendChild(this._inputLine);
	this._input.appendChild(this._cursor);
	this._innerWindow.appendChild(this._output);
	this._innerWindow.appendChild(this._input);
	this.html.appendChild(this._innerWindow);
	this.setBackgroundColor("black");
	this.setTextColor("white");
	this.setTextSize("1em");
	this.setWidth("100%");
	this.setHeight("100%");
	this.html.style.fontFamily = "Monaco, Courier";
	this.html.style.margin = "0";
	this.html.style.overflow = "auto";
	this.html.style.resize = "auto";
	this._innerWindow.style.padding = "10px";
	this._input.style.margin = "0";
	this._output.style.margin = "0";
	this._cursor.style.background = "white";
	this._cursor.innerHTML = "&nbsp;";
	this._cursor.style.display = "none";
	this._input.style.display = "none";
	this._cursorBlinkRate = 500;
	this.setPrompt("$ ");
};
terminaljs_Terminal.triggerCursor = function(inputField,terminal,blinkRate) {
	window.setTimeout(function() {
		if(terminal._shouldBlinkCursor) {
			terminal._cursor.style.visibility = terminal._cursor.style.visibility == "visible" ? "hidden" : "visible";
		} else {
			terminal._cursor.style.visibility = "visible";
		}
		terminaljs_Terminal.triggerCursor(inputField,terminal,blinkRate);
	},blinkRate);
};
terminaljs_Terminal.initInput = function(terminal) {
	var inputField = window.document.createElement("input");
	terminal._inputField = inputField;
	inputField.style.position = "absolute";
	inputField.style.zIndex = "-100";
	inputField.style.outline = "none";
	inputField.style.border = "none";
	inputField.style.opacity = "0";
	inputField.style.fontSize = "0.2em";
	terminal._inputLine.textContent = "";
	terminal._input.style.display = "block";
	terminal.html.appendChild(inputField);
	terminaljs_Terminal.triggerCursor(inputField,terminal,terminal._cursorBlinkRate);
	terminal._cursor.style.display = "inline";
	terminal.html.onclick = function() {
		inputField.focus();
	};
	inputField.onkeydown = function(e) {
		if(e.key == "LeftArrow" || e.key == "UpArrow" || e.key == "RightArrow" || e.key == "DownArrow" || e.key == "Tab") {
			e.preventDefault();
		} else if(e.key != "Enter") {
			window.setTimeout(function() {
				terminal._inputLine.textContent = inputField.value;
			},1);
		}
	};
	inputField.onkeyup = function(e1) {
		if(e1.key == "Enter") {
			terminal.validate();
		}
	};
	inputField.focus();
};
terminaljs_Terminal.prototype = {
	validate: function() {
		var inputValue = this._inputField.value;
		this._inputLine.textContent = "";
		this._inputField.value = "";
		this.print(this._preCursor + inputValue);
		this._callback(inputValue);
	}
	,print: function(message) {
		var newLine = window.document.createElement("p");
		newLine.style.margin = "0";
		newLine.style.fontFamily = "inherit";
		newLine.innerHTML = message;
		this._output.appendChild(newLine);
		this.html.scrollTop = this.html.scrollHeight;
	}
	,append: function(element) {
		this._output.appendChild(element);
		this.html.scrollTop = this.html.scrollHeight;
	}
	,input: function(callback) {
		this._callback = callback;
		terminaljs_Terminal.initInput(this);
	}
	,clear: function() {
		this._output.innerHTML = "";
	}
	,setTextSize: function(size) {
		this._output.style.fontSize = size;
		this._input.style.fontSize = size;
	}
	,setTextColor: function(col) {
		this.html.style.color = col;
		this._cursor.style.background = col;
	}
	,setBackgroundColor: function(col) {
		this.html.style.background = col;
		this._cursor.style.color = col;
	}
	,setWidth: function(width) {
		this.html.style.width = width;
	}
	,setHeight: function(height) {
		this.html.style.height = height;
	}
	,setPrompt: function(prompt) {
		this._preCursor = prompt;
		this._inputLinePre.innerHTML = this._preCursor;
	}
	,setCursorBlinkRate: function(blinkRate) {
		this._cursorBlinkRate = blinkRate;
	}
	,blinkCursor: function(value) {
		this._shouldBlinkCursor = value;
	}
};
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this);
