import { getDpr } from '../util/device';

export abstract class Painter {

    barCnt: number;

    // Canvas width and height
    width: number;
    height: number;

    isPainted: boolean;

    protected _canvas: HTMLCanvasElement;
    protected _ctx: CanvasRenderingContext2D;
    protected _dpr: number;

    constructor(canvas: HTMLCanvasElement) {
        this._dpr = getDpr();

        canvas.width = canvas.clientWidth * this._dpr;
        canvas.height = canvas.clientHeight * this._dpr;
        this.width = canvas.width;
        this.height = canvas.height;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');

        this.barCnt = 100;
        this.isPainted = false;
    }

    paint(data: number[]) {
        this.isPainted = true;
    }

    clear() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

}
