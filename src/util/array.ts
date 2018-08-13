/**
* use average value to decrease arrary length
*
* @param {number[]} source     source array
* @param {number}   distLength output length
* @return {number[]} output array
*/
export function shrinkArray(source: number[], distLength: number): number[] {
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

/**
 * remove continuous elements at the begining and end of the array
 * that value is less than threshold
 *
 * @param {number[]} arr       normalized data
 * @param {number}   threshold comparing value
 */
export function trimArray(arr: number[], threshold): number[] {
    let result = arr;

    // from begining
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i] > threshold) {
            if (i > 0) {
                result = arr.slice(i);
                break;
            }
        }
    }

    // from end
    for (let i = result.length - 1; i >= 0; --i) {
        if (arr[i] > threshold) {
            if (i < result.length - 1) {
                result = result.slice(0, i + 1);
                break;
            }
        }
    }

    return result;
}

export function normalize(arr: number[]): number[] {
    const maxValue = max(arr);
    if (maxValue > 0) {
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = arr[i] / maxValue;
        }
    }
    return arr;
}

export function max(arr: number[]): number {
    let m = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i] > m) {
            m = arr[i];
        }
    }
    return m;
}
