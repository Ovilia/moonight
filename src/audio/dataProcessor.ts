import { Recorder } from './recorder';
import { shrinkArray, normalize } from '../util/array';

export class DataProcessor {

    recorder: Recorder;

    constructor() {
        this.recorder = null;
    }


    fromRecord(record: Recorder): Float32Array {
        if (!this.recorder) {
            console.error('Not record yet. Please call recordStart() first.');
            return null;
        }
        else {
            return this.recorder.getChannelData();
        }
    }

    fromFile(localPath: string): Promise<Float32Array> {
        return new Promise((resolve, reject) => {
            const audioCtx = new AudioContext();
            var request = new XMLHttpRequest();
            request.open('GET', localPath, true);
            request.responseType = 'arraybuffer';

            request.onload = function() {
                var source = audioCtx.createBufferSource();
                audioCtx.decodeAudioData(request.response, function(buffer) {
                    var leftChannel = buffer.getChannelData(0);
                    resolve(leftChannel);
                }, function(e){
                    console.error(e);
                    reject(e);
                });
            };
            request.send();
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
        return normalize(shrinkArray(data, barCnt));
    }

}
