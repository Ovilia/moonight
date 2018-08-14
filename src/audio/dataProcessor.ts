import { Recorder } from './recorder';
import { shrinkArray, normalize, trimArray, abs } from '../util/array';

export class DataProcessor {

    recorder: Recorder;

    constructor() {
        this.recorder = null;
    }


    fromRecord(recorder: Recorder): Promise<Float32Array> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = err => {
                reject(err);
            }
            fileReader.readAsArrayBuffer(recorder.getData());
        })
            .then(arrayBuffer => {
                return this.fromArrayBuffer(arrayBuffer as ArrayBuffer);
            });
    }

    fromFile(localPath: string): Promise<Float32Array> {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open('GET', localPath, true);
            request.responseType = 'arraybuffer';

            request.onload = () => {
                resolve(request.response);
            };
            request.onerror = err => {
                reject(err);
            }
            request.send();
        })
            .then(arrayBuffer => {
                return this.fromArrayBuffer(arrayBuffer as ArrayBuffer);
            });
    }

    fromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<Float32Array> {
        return new Promise((resolve, reject) => {
            const audioCtx = new AudioContext();
            audioCtx.decodeAudioData(arrayBuffer, buffer => {
                const data = buffer.getChannelData(0);
                resolve(data);
            }, e => {
                console.error(e);
                reject(e);
            });
        });
    }

    recordStart() {
        if (!this.recorder) {
            this.recorder = new Recorder();
            this.recorder.start();
        }
    }

    recordStop() {
        if (this.recorder) {
            this.recorder.stop();
        }
    }

    getDisplayTimeDomainData(data: Float32Array, barCnt: number): number[] {
        const arr = Array.prototype.slice.call(data);
        const trimed = trimArray(normalize(abs(arr)), 0.05);
        return normalize(shrinkArray(trimed, barCnt));
    }

}
