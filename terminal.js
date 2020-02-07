/*! terminal.js v3.0 | (c) 2020 Samuel Hawksby-Robinson | https://github.com/Samyoul/terminaljs */

let Terminal = (function () {
	let triggerCursor = function (inputField, terminal, blinkRate = 500) {
        setTimeout(function () {
            if (terminal._shouldBlinkCursor) {
                terminal._cursor.style.visibility = terminal._cursor.style.visibility === 'visible' ? 'hidden' : 'visible';
            } else {
                terminal._cursor.style.visibility = 'visible';
            }

            triggerCursor(inputField, terminal, blinkRate)
        }, blinkRate);
    };

	function initInput(terminal, callback) {
		let inputField = document.createElement('input');

		inputField.style.position = 'absolute';
		inputField.style.zIndex = '-100';
		inputField.style.outline = 'none';
		inputField.style.border = 'none';
		inputField.style.opacity = '0';
		inputField.style.fontSize = '0.2em';

		terminal._inputLine.textContent = '';
		terminal._input.style.display = 'block';
		terminal.html.appendChild(inputField);

		triggerCursor(inputField, terminal, terminal._cursorBlinkRate);
		terminal._cursor.style.display = 'inline';

		terminal.html.onclick = function () {
			inputField.focus()
		};

		inputField.onkeydown = function (e) {
			if (e.key === "LeftArrow" || e.key === "UpArrow" || e.key === "RightArrow" || e.key === "DownArrow" || e.key === "Tab") {
				e.preventDefault()
			} else if (e.key !== "Enter") {
				setTimeout(function () {
					terminal._inputLine.textContent = inputField.value
				}, 1)
			}
		};
		inputField.onkeyup = function (e) {
			if (e.key === "Enter") {
				let inputValue = inputField.value;
				terminal._inputLine.textContent = '';
				inputField.value = '';

				terminal.print(terminal._preCursor + inputValue);
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
		this._inputLine = document.createElement('span'); // the span element where the users input is put
		this._cursor = document.createElement('span');
		this._input = document.createElement('p'); // the full element administering the user input, including cursor

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
			initInput(this, callback)
		};

		this.clear = function () {
			this._output.innerHTML = ''
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
            this._cursor.style.color = col;
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

		this.setCursorBlinkRate = function (blinkRate) {
			this._cursorBlinkRate = blinkRate
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
		this._cursorBlinkRate = 500;
	};
}());