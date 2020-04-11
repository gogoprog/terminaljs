package terminaljs;

import js.Browser.document;

@:expose("Terminal")
class Terminal {
    public var html:js.html.Element;

    private var _innerWindow = document.createElement('div');
    private var _output = document.createElement('p');
    private var _inputLinePre = document.createElement('span');
    private var _inputLine = document.createElement('span'); // the span element where the users input is put
    private var _cursor = document.createElement('span');
    private var _input = document.createElement('p'); // the full element administering the user input, including cursor
    private var _shouldBlinkCursor = true;
    private var _preCursor:String = "";
    private var _cursorBlinkRate:Int = 500;

    static private function triggerCursor(inputField:js.html.Element, terminal:Terminal, blinkRate:Int) {
        js.Browser.window.setTimeout(function() {
            if(terminal._shouldBlinkCursor) {
                terminal._cursor.style.visibility = terminal._cursor.style.visibility == 'visible' ? 'hidden' : 'visible';
            } else {
                terminal._cursor.style.visibility = 'visible';
            }

            triggerCursor(inputField, terminal, blinkRate);
        }, blinkRate);
    };

    static private function initInput(terminal:Terminal, callback:String->Void) {
        var inputField = document.createElement('input');
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
        terminal.html.onclick = function() {
            inputField.focus();
        };
        inputField.onkeydown = function(e) {
            if(e.key == "LeftArrow" || e.key == "UpArrow" || e.key == "RightArrow" || e.key == "DownArrow" || e.key == "Tab") {
                e.preventDefault();
            } else if(e.key != "Enter") {
                js.Browser.window.setTimeout(function() {
                    terminal._inputLine.textContent = untyped inputField.value;
                }, 1);
            }
        };
        inputField.onkeyup = function(e) {
            if(e.key == "Enter") {
                var inputValue = untyped inputField.value;
                terminal._inputLine.textContent = '';
                untyped inputField.value = '';
                terminal.print(terminal._preCursor + inputValue);
                callback(inputValue);
            }
        };
        inputField.focus();
    }

    public function new(?id:String) {
        this.html = document.createElement('div');
        this.html.className = 'Terminal';

        if(id != null) {
            this.html.id = id;
        }

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
        this._cursor.innerHTML = '&nbsp;';
        this._cursor.style.display = 'none';
        this._input.style.display = 'none';
        this._cursorBlinkRate = 500;
        this.setPreCursor("$ ");
    }


    public function print(message) {
        var newLine = document.createElement('p');
        newLine.style.margin = '0';
        newLine.style.fontFamily = 'inherit';
        newLine.innerHTML = message;
        this._output.appendChild(newLine);
        this.html.scrollTop = this.html.scrollHeight;
    };
    public function append(element) {
        this._output.appendChild(element);
        this.html.scrollTop = this.html.scrollHeight;
    };
    public function input(callback) {
        initInput(this, callback);
    };
    public function clear() {
        this._output.innerHTML = '';
    };
    public function setTextSize(size) {
        this._output.style.fontSize = size;
        this._input.style.fontSize = size;
    };
    public function setTextColor(col) {
        this.html.style.color = col;
        this._cursor.style.background = col;
    };
    public function setBackgroundColor(col) {
        this.html.style.background = col;
        this._cursor.style.color = col;
    };
    public function setWidth(width) {
        this.html.style.width = width;
    };
    public function setHeight(height) {
        this.html.style.height = height;
    };
    public function setPreCursor(precursor) {
        this._preCursor = precursor;
        this._inputLinePre.innerHTML = this._preCursor;
    };
    public function setCursorBlinkRate(blinkRate) {
        this._cursorBlinkRate = blinkRate;
    };
    public function blinkingCursor(value) {
        this._shouldBlinkCursor = value;
    };
}
