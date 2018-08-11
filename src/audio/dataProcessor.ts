import {shrinkArray, normalize} from '../util/array';

export class DataProcessor {

    constructor() {

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

    getDisplayTimeDomainData(data: Float32Array, barCnt: number): number[] {
        return normalize(shrinkArray(data, barCnt));
    }

}
