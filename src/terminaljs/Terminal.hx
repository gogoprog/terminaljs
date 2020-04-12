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
    private var _inputField:js.html.Element;
    private var _callback:String->Void;
    private var _keyDownCallback:Dynamic->Void;

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

    static private function initInput(terminal:Terminal) {
        var inputField = document.createElement('input');
        terminal._inputField = inputField;
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
            if(e.key == "ArrowLeft" || e.key == "ArrowUp" || e.key == "ArrowRight" || e.key == "ArrowDown" || e.key == "Tab") {
                e.preventDefault();

                if(terminal._keyDownCallback != null) {
                    terminal._keyDownCallback(e);
                }
            } else if(e.key != "Enter") {
                js.Browser.window.setTimeout(function() {
                    terminal._inputLine.textContent = untyped inputField.value;
                }, 0);
            }
        };
        inputField.onkeyup = function(e) {
            if(e.key == "Enter") {
                terminal.validate();
            }
        };
        inputField.focus();
    }

    private function validate() {
        var inputValue = untyped _inputField.value;
        _inputLine.textContent = '';
        untyped _inputField.value = '';
        print(_preCursor + inputValue);
        _callback(inputValue);
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
        this.setPrompt("$ ");
    }


    public function print(message) {
        var newLine = document.createElement('p');
        newLine.style.margin = '0';
        newLine.style.fontFamily = 'inherit';
        newLine.innerHTML = message;
        this._output.appendChild(newLine);
        this.html.scrollTop = this.html.scrollHeight;
    }

    public function append(element) {
        this._output.appendChild(element);
        this.html.scrollTop = this.html.scrollHeight;
    }

    public function input(callback:String->Void) {
        _callback = callback;
        initInput(this);
    }

    public function keyDown(callback:Dynamic->Void) {
        _keyDownCallback = callback;
    }

    public function clear() {
        this._output.innerHTML = '';
    }

    public function setTextSize(size:String) {
        this._output.style.fontSize = size;
        this._input.style.fontSize = size;
    }

    public function setTextColor(col:String) {
        this.html.style.color = col;
        this._cursor.style.background = col;
    }

    public function setBackgroundColor(col:String) {
        this.html.style.background = col;
        this._cursor.style.color = col;
    }

    public function setWidth(width:String) {
        this.html.style.width = width;
    }

    public function setHeight(height:String) {
        this.html.style.height = height;
    }

    public function setPrompt(prompt:String) {
        this._preCursor = prompt;
        this._inputLinePre.innerHTML = this._preCursor;
    }

    public function setCursorBlinkRate(blinkRate:Int) {
        this._cursorBlinkRate = blinkRate;
    }

    public function blinkCursor(value:Bool) {
        this._shouldBlinkCursor = value;
    }

    public function setInput(value:String) {
        untyped _inputField.value = value;
        _inputLine.textContent = untyped _inputField.value;
    }
}
