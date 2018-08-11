export function getDpr(): number {
    return window.devicePixelRatio || 2;
}

export function getUserMedia(constraints: MediaStreamConstraints)
    : Promise<MediaStream>
{
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }
    else {
        return null;
    }
}
