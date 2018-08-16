import { initialAudioData } from './util/audio';

import { Recorder } from './audio/recorder';
import { SketchPainter } from './painters/sketchPainter';
import { DataProcessor } from './audio/dataProcessor';

import { RecordButton } from './gui/buttons/recordButton';
import { DownloadButton } from './gui/buttons/download';
import { CancelButton } from './gui/buttons/cancelButton';
import { StopButton } from './gui/buttons/stopButton';
import { GuiManager } from './gui/guiManager';
import { mediaRecorderSupported, audioSupported } from './util/env';
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
        hint.innerHTML = '请在右上角打开浏览器访问';
    }
    else {
        initGUI();
    }

    if (!mediaRecorderSupported() || !audioSupported()) {
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
    painter = new SketchPainter(svg);

    painter.paint(initialAudioData, '');
    painter.paintTitle();

    recorder = new Recorder();


    setTimeout(function () {
        loadFont();
    }, 2000);
}

function initGUI() {
    buttons = {};

    const svg = document.getElementById('gui') as any;
    guiManager = new GuiManager(svg);

    buttons.record = new RecordButton(svg, guiManager.rc);
    buttons.record.onclick(recordStart);
    guiManager.addButton(buttons.record);

    function recordStart() {
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

        recorder.start();
    }

    function recordStop() {
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
            });

        resetButtons();
    }

    function recordCancel() {
        resetButtons();
    }

    function resetButtons() {
        guiManager.removeButton(buttons.cancel);
        guiManager.removeButton(buttons.stop);
        guiManager.removeButton(buttons.download);
        guiManager.addButton(buttons.record);
    }

    function downloadImage() {
        painter.exportImage();
    }
}

function loadFont() {
    const style = document.createElement('style');
    const node = document.createTextNode(`
        @font-face {
            font-family: 'xiaowei';
            src: url('https://webserver-1256209664.cos.ap-shanghai.myqcloud.com/moonight/xiaowei.woff')
                format('woff'),
                url('https://webserver-1256209664.cos.ap-shanghai.myqcloud.com/moonight/xiaowei.otf')
                format('opentype'),
                url('https://webserver-1256209664.cos.ap-shanghai.myqcloud.com/moonight/xiaowei.ttf')
                format('truetype');
        }
    `);
    style.appendChild(node);
}
