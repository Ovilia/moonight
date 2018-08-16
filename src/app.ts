declare const require;
require('md-gum-polyfill');

import { initialAudioData } from './util/audio';

import { Recorder } from './audio/recorder';
import { SketchPainter } from './painters/sketchPainter';
import { DataProcessor } from './audio/dataProcessor';

import { RecordButton } from './gui/buttons/recordButton';
import { DownloadButton } from './gui/buttons/download';
import { CancelButton } from './gui/buttons/cancelButton';
import { StopButton } from './gui/buttons/stopButton';
import { GuiManager } from './gui/guiManager';
import { mediaRecorderSupported, audioSupported, getUserMediaSupported, logEvent }
    from './util/env';
import { getUserMedia, isWeixin } from './util/device';

const dataProcessor = new DataProcessor();

let painter: SketchPainter;
let recorder: Recorder;

let guiManager: GuiManager;
let buttons: {
    record?: RecordButton,
    stop?: StopButton,
    cancel?: CancelButton,
    download?: DownloadButton
};

window.onload = init;


function init() {
    if (isWeixin()) {
        const hint = document.getElementById('hint');
        hint.innerHTML = '右上角在 Safari 中打开';
        hint.style.display = 'block';
    }
    else {
        initGUI();
    }

    logEvent('env', 'recorder', mediaRecorderSupported());
    logEvent('env', 'audio', audioSupported());
    logEvent('env', 'media', getUserMediaSupported());

    if (!mediaRecorderSupported() || !audioSupported()
        || !getUserMediaSupported()
    ) {
        location.href = 'not-supported.html';
    }

    getUserMedia({
        audio: true,
        video: false
    })
        .then(stream => {
            // Not record yet, just for permission
            stream.getTracks().forEach(track => track.stop());
        });

    const svg = document.getElementById('main-svg') as any;

    if (window.innerWidth < 400) {
        svg.style['margin-left'] = -window.innerWidth / 2 + 'px';
    }

    painter = new SketchPainter(svg);

    reset();

    recorder = new Recorder();
}

function reset() {
    painter.paint(initialAudioData, '');
    painter.paintTitle();
}

function initGUI() {
    buttons = {};

    const svg = document.getElementById('gui') as any;

    if (window.innerWidth < 400) {
        svg.style['margin-left'] = -window.innerWidth / 2 + 'px';
    }

    guiManager = new GuiManager(svg);

    buttons.record = new RecordButton(svg, guiManager.rc);
    buttons.record.onclick(recordStart);
    guiManager.addButton(buttons.record);

    function recordStart() {
        logEvent('record', 'start');
        painter.paintLoading();

        if (!buttons.stop) {
            buttons.stop = new StopButton(svg, guiManager.rc);
            buttons.stop.onclick(recordStop);
        }

        if (!buttons.cancel) {
            buttons.cancel = new CancelButton(svg, guiManager.rc);
            buttons.cancel.onclick(recordCancel);
        }

        guiManager.addButton(buttons.stop);
        guiManager.addButton(buttons.cancel);
        guiManager.removeButton(buttons.record);
        guiManager.removeButton(buttons.download);

        recorder.start()
            .catch(err => {
                console.log(err);
                reset();
            });
    }

    function recordStop() {
        logEvent('record', 'stop');
        recorder.stop()
            .then(() => {
                return dataProcessor.fromRecord(recorder);
            })
            .then(data => {
                const displayData = dataProcessor
                    .getDisplayTimeDomainData(data, 64);
                painter.paint(displayData, '点击修改文字');

                if (!buttons.download) {
                    buttons.download = new DownloadButton(svg, guiManager.rc);
                    buttons.download.onclick(downloadImage);
                }
                guiManager.addButton(buttons.download);
            })
            .catch(err => {
                console.log(err);
                reset();
            });

        resetButtons();
    }

    function recordCancel() {
        logEvent('record', 'cancel');
        reset();
        resetButtons();
        recorder.stop()
            .catch(err => {
                console.log(err);
                reset();
            });
    }

    function resetButtons() {
        guiManager.removeButton(buttons.cancel);
        guiManager.removeButton(buttons.stop);
        guiManager.removeButton(buttons.download);
        guiManager.addButton(buttons.record);
    }

    function downloadImage() {
        logEvent('action', 'download');
        painter.exportImage();
    }
}
