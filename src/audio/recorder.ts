import { getUserMedia } from '../util/device';


export class Recorder {

    constructor() {
    }


    start() {
        if (getUserMedia) {
            return getUserMedia({ audio: true })
                .then(stream => {
                    // const mediaRecorder = new MediaRecorder(stream);
                });
        }
        else {
            return new Promise((resolve, reject) => reject({
                code: -1,
                message: 'getUserMedia not supported.'
            }));
        }
    }

    stop() {

    }

    getChannelData(): Float32Array {
        return new Float32Array(1);
    }

}