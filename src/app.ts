import { SketchPainter } from './painters/sketchPainter';
import { DataProcessor } from './audio/dataProcessor';

const dataProcessor = new DataProcessor();

let canvas;
let painter;

window.onload = init;


function init() {
    canvas = document.getElementById('main-canvas');
    painter = new SketchPainter(canvas);

    initGUI();
}

function record() {
    console.log('record');
}

function initGUI() {
    const recordBtn = document.getElementById('record-btn');
    recordBtn.onclick = function () {
        record();
    };
}
