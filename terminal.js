/*! terminal.js v2.0 | (c) 2014 Erik Österberg | https://github.com/eosterberg/terminaljs */

let Terminal = (function () {
	let fireCursorInterval = function (inputField, terminalObj) {
		let cursor = terminalObj._cursor;
		setTimeout(function () {
			if (inputField.parentElement && terminalObj._shouldBlinkCursor) {
				cursor.style.visibility = cursor.style.visibility === 'visible' ? 'hidden' : 'visible';
				fireCursorInterval(inputField, terminalObj)
			} else {
				cursor.style.visibility = 'visible'
			}
		}, 500)
	};

	function promptInput(terminalObj, callback) {
		let inputField = document.createElement('input');

		inputField.style.position = 'absolute';
		inputField.style.zIndex = '-100';
		inputField.style.outline = 'none';
		inputField.style.border = 'none';
		inputField.style.opacity = '0';
		inputField.style.fontSize = '0.2em';

		terminalObj._inputLine.textContent = '';
		terminalObj._input.style.display = 'block';
		terminalObj.html.appendChild(inputField);

		fireCursorInterval(inputField, terminalObj);
		terminalObj._cursor.style.display = 'inline';

		terminalObj.html.onclick = function () {
			inputField.focus()
		};

		inputField.onkeydown = function (e) {
			if (e.key === "LeftArrow" || e.key === "UpArrow" || e.key === "RightArrow" || e.key === "DownArrow" || e.key === "Tab") {
				e.preventDefault()
			} else if (e.key !== "Enter") {
				setTimeout(function () {
					terminalObj._inputLine.textContent = inputField.value
				}, 1)
			}
		};
		inputField.onkeyup = function (e) {
			if (e.key === "Enter") {
				let inputValue = inputField.value;
				terminalObj._inputLine.textContent = '';
				inputField.value = '';

				terminalObj.print(terminalObj._preCursor + inputValue);
				callback(inputValue)
			}
		};
	}

	return function (id) {
		this.html = document.createElement('div');
		this.html.className = 'Terminal';
		if (typeof(id) === 'string') { this.html.id = id }

		this._innerWindow = document.createElement('div');
		this._output = document.createElement('p');
		this._inputLinePre = document.createElement('span');
		this._inputLine = document.createElement('span'); //the span element where the users input is put
		this._cursor = document.createElement('span');
		this._input = document.createElement('p'); //the full element administering the user input, including cursor

		this._shouldBlinkCursor = true;

		this.print = function (message) {
			let newLine = document.createElement('pre');
			newLine.style.margin = '0';
			newLine.style.fontFamily = 'inherit';

			newLine.textContent = message;
			this._output.appendChild(newLine);
			this.html.scrollTop = this.html.scrollHeight;
		};

		this.input = function(callback) {
			promptInput(this, callback)
		};

		this.clear = function () {
			this._output.innerHTML = ''
		};

		this.sleep = function (milliseconds, callback) {
			setTimeout(callback, milliseconds)
		};

		this.setTextSize = function (size) {
			this._output.style.fontSize = size;
			this._input.style.fontSize = size
		};

		this.setTextColor = function (col) {
			this.html.style.color = col;
			this._cursor.style.background = col;
		};

		this.setBackgroundColor = function (col) {
			this.html.style.background = col;
		};

		this.setWidth = function (width) {
			this.html.style.width = width
		};

		this.setHeight = function (height) {
			this.html.style.height = height
		};

		this.setPreCursor = function (precursor) {
			this._preCursor = precursor
        };

		this.blinkingCursor = function (bool) {
			bool = bool.toString().toUpperCase();
			this._shouldBlinkCursor = (bool === 'TRUE' || bool === '1' || bool === 'YES')
		};

		this._input.appendChild(this._inputLinePre);
		this._input.appendChild(this._inputLine);
		this._input.appendChild(this._cursor);
		this._innerWindow.appendChild(this._output);
		this._innerWindow.appendChild(this._input);
		this.html.appendChild(this._innerWindow);

		this.setBackgroundColor('black');
		this.setTextColor('white');
		this.setTextSize('1em');
		this.setWidth('100%');
		this.setHeight('100%');

		this.html.style.fontFamily = 'Monaco, Courier';
		this.html.style.margin = '0';
		this.html.style.overflow = 'auto';
		this.html.style.resize = 'auto';
		this._innerWindow.style.padding = '10px';
		this._input.style.margin = '0';
		this._output.style.margin = '0';
		this._cursor.style.background = 'white';
		this._cursor.innerHTML = 'C'; //put something in the cursor..
		this._cursor.style.display = 'none'; //then hide it
		this._input.style.display = 'none';
        this._preCursor = '$ ';
		this._inputLinePre.textContent = this._preCursor;
	};
}());