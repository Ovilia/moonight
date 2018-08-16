import { getUserMedia } from '../util/device';

declare const MediaRecorder;

export class Recorder {

    protected _mediaRecorder;
    protected _audioChunks;
    protected _stream: MediaStream;

    constructor() {
        this._audioChunks = [];
    }


    start(): Promise<any> {
        if (getUserMedia) {
            return getUserMedia({
                audio: true,
                video: false
            })
                .then(stream => {
                    this._stream = stream;
                    this._mediaRecorder = new MediaRecorder(stream);
                    this._mediaRecorder.start();
                    this._audioChunks = [];

                    return new Promise((resolve, reject) => {
                        this._mediaRecorder.addEventListener(
                            'dataavailable',
                            event => {
                                this._audioChunks.push(event.data);
                                resolve();
                            }
                        );
                    });
                });
        }
        else {
            return new Promise((resolve, reject) => reject({
                code: -1,
                message: 'getUserMedia not supported.'
            }));
        }
    }

    stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._mediaRecorder) {
                this._mediaRecorder.addEventListener('stop', () => {
                    this._stream.getTracks()
                        .forEach(track => track.stop());
                    resolve();
                });
                this._mediaRecorder.stop();
            }
            else {
                reject({
                    code: -2,
                    message: 'Start audio first.'
                });
            }
        });
    }

    getData(): Blob {
        return new Blob(this._audioChunks);
    }

}