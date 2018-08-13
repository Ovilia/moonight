import { getUserMedia } from '../util/device';

declare const MediaRecorder;

export class Recorder {

    protected _mediaRecorder;
    protected _audioChunks;

    constructor() {
        this._audioChunks = [];
    }


    start() {
        if (getUserMedia) {
            return getUserMedia({
                audio: true,
                video: false
            })
                .then(stream => {
                    this._mediaRecorder = new MediaRecorder(stream);
                    this._mediaRecorder.start();
                    this._audioChunks = [];

                    return new Promise((resolve, reject) => {
                        this._mediaRecorder.addEventListener(
                            'dataavailable',
                            event => {
                                this._audioChunks.push(event.data);
                                console.log('dataavailable', this._audioChunks);
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