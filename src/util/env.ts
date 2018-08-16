declare const MediaRecorder;
declare const ga;

export function audioSupported() {
    return !!getAudioContext();
}

export function getAudioContext() {
    const w = window as any;
    return w.AudioContext || w.webkitAudioContext || null;
}

export function getUserMediaSupported() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

export function mediaRecorderSupported() {
    return !!MediaRecorder;
}

export function getMediaRecorder() {
    return MediaRecorder;
}

export function logEvent(category, action, label?) {
    if (typeof 'ga' === 'function') {
        ga('send', 'event', category, action, label);
    }
}
