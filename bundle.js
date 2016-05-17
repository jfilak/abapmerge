(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var File = (function () {
    function File(n, c) {
        this.name = n;
        this.contents = c;
    }
    File.prototype.getName = function () {
        return this.name;
    };
    File.prototype.getContents = function () {
        return this.contents;
    };
    return File;
}());
exports.__esModule = true;
exports["default"] = File;

},{}],2:[function(require,module,exports){
"use strict";
var Merge = (function () {
    function Merge() {
    }
    Merge.merge = function (files, main) {
        this.files = files;
        this.used = 0;
        return this.analyze(this.fileByName(main));
    };
    Merge.fileByName = function (name) {
        for (var _i = 0, _a = this.files; _i < _a.length; _i++) {
            var file = _a[_i];
            if (file.getName().toLowerCase() === name.toLowerCase()) {
                this.used++;
                return file.getContents();
            }
        }
        throw "file not found: " + name;
    };
    Merge.analyze = function (contents) {
        var output = "";
        var lines = contents.split("\n");
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var include = line.match(/^\s?INCLUDE\s+(\w+)\s*.\s*$/i);
            if (include) {
                output = output +
                    this.comment(include[1]) +
                    this.fileByName(include[1]) +
                    "\n";
            }
            else {
                output = output + line + "\n";
            }
        }
        this.checkFiles();
        return output;
    };
    Merge.checkFiles = function () {
        // just comparing the length is not completely correct, but it will work for now
        if (this.used !== this.files.length) {
            throw "not all files used";
        }
    };
    Merge.comment = function (name) {
        return "****************************************************\n" +
            "* abapmerge - " + name.toUpperCase() + "\n" +
            "****************************************************\n";
    };
    return Merge;
}());
exports.__esModule = true;
exports["default"] = Merge;

},{}],3:[function(require,module,exports){
"use strict";
var file_1 = require("./file");
var merge_1 = require("./merge");
var files;
function fname(s) {
    return s.split(".")[0];
}
function onClick(e) {
    var merged = "";
    try {
        merged = merge_1["default"].merge(files, e.srcElement.text);
    }
    catch (err) {
        alert(err);
        return;
    }
    document.getElementById("filelist").innerHTML =
        "<pre>" +
            merged +
            "</pre>";
}
exports.onClick = onClick;
function redraw() {
    var html = "Select main file:<br>";
    for (var i = 0; i < files.length; i++) {
        html = html +
            "<a id='myLink" + i + "' title='Set as main' href='#' value=''>" +
            files[i].getName() +
            "</a><br>";
    }
    document.getElementById("filelist").innerHTML = html;
    for (var i = 0; i < files.length; i++) {
        document.getElementById("myLink" + i).onclick = onClick;
    }
}
function reset() {
    files = [];
    document.getElementById("filelist").innerHTML = "";
}
function setupReader(file) {
    var name = file.name;
    var reader = new FileReader();
    reader.onload = function (e) {
        files.push(new file_1["default"](fname(name), reader.result));
        redraw();
    };
    reader.readAsText(file);
}
function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    var input = event.dataTransfer.files;
    reset();
    for (var i = 0; i < input.length; i++) {
        setupReader(input[i]);
    }
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy"; // explicitly show this is a copy.
}
function setup_listeners() {
    var dropZone = document.getElementById("drop_zone");
    dropZone.addEventListener("dragover", handleDragOver, false);
    dropZone.addEventListener("drop", handleFileSelect, false);
}
document.body.onload = setup_listeners;

},{"./file":1,"./merge":2}]},{},[3]);
