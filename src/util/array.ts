/**
* use average value to decrease arrary length
*
* @param {ArrayBuffer} source     source array
* @param {number}      distLength output length
* @return {number[]} output array
*/
export function shrinkArray(source: Float32Array, distLength: number): number[] {
    let sum = 0;
    const step = Math.floor(source.length / distLength);
    const dist = new Array(distLength);
    for (let i = 0, distId = 0; distId < distLength - 1; ++i) {
        sum += Math.abs(source[i]);

        if (i % step === step - 1) {
            const avg = sum / step;
            dist[distId] = isNaN(avg) ? 0 : avg;
            if (isNaN(avg)) {
                console.log(sum, step, i, source[i]);
            }
            ++distId;
            sum = 0;
        }
    }
    return dist;
}

export function normalize(arr): number[] {
    const maxValue = max(arr);
    if (maxValue > 0) {
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = arr[i] / maxValue;
        }
    }
    return arr;
}

export function max(arr: any[]): number {
    let m = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i] > m) {
            m = arr[i];
        }
    }
    return m;
}
