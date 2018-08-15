declare const MediaRecorder;


export function audioSupported() {
    return !!getAudioContext();
}

export function getAudioContext() {
    const w = window as any;
    return w.AudioContext || w.webkitAudioContext || null;
}

export function mediaRecorderSupported() {
    return !!MediaRecorder;
}

export function getMediaRecorder() {
    return MediaRecorder;
}
