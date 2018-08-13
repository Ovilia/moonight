import { Recorder } from './audio/recorder';
import { CancelButton } from './gui/buttons/cancelButton';
import { SketchPainter } from './painters/sketchPainter';
import { DataProcessor } from './audio/dataProcessor';

import { RecordButton } from './gui/buttons/recordButton';
import { OpenButton } from './gui/buttons/openButton';
import { StopButton } from './gui/buttons/stopButton';
import { GuiManager } from './gui/guiManager';
import { Painter } from './painters/painter';

const dataProcessor = new DataProcessor();

let painter: Painter;
let recorder: Recorder;

let guiManager: GuiManager;
let buttons: {
    record?: RecordButton,
    open?: OpenButton,
    stop?: StopButton,
    cancel?: CancelButton
};

window.onload = init;


function init() {
    const svg = document.getElementById('main-svg');
    painter = new SketchPainter(svg as any);

    recorder = new Recorder();

    initGUI();
}

function initGUI() {
    buttons = {};

    const svg = document.getElementById('gui') as any;
    guiManager = new GuiManager(svg);

    buttons.record = new RecordButton(svg, guiManager.rc);
    buttons.record.onclick(recordStart);
    guiManager.addButton(buttons.record);

    buttons.open = new OpenButton(svg, guiManager.rc);
    guiManager.addButton(buttons.open);

    function recordStart() {
        buttons.stop = new StopButton(svg, guiManager.rc);
        buttons.stop.onclick(recordStop);

        buttons.cancel = new CancelButton(svg, guiManager.rc);
        buttons.cancel.onclick(recordCancel);

        guiManager.addButton(buttons.stop);
        guiManager.addButton(buttons.cancel);
        guiManager.removeButton(buttons.open);
        guiManager.removeButton(buttons.record);

        recorder.start();
    }

    function recordStop() {
        recorder.stop()
            .then(() => {
                return dataProcessor.fromRecord(recorder);
            })
            .then(data => {
                console.log(data);
            });

        resetButtons();
    }

    function recordCancel() {
        resetButtons();
    }

    function resetButtons() {
        guiManager.removeButton(buttons.cancel);
        guiManager.removeButton(buttons.stop);
        guiManager.addButton(buttons.record);
        guiManager.addButton(buttons.open);
    }
}
