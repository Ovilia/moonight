// window.MediaRecorder = require('audio-recorder-polyfill');

import recorder from 'audio-recorder-polyfill';

(window as any).MediaRecorder = recorder;
