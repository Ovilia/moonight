import { getDpr } from '../util/device';

export abstract class Painter {

    barCnt: number;

    // Canvas width and height
    width: number;
    height: number;

    isPainted: boolean;

    constructor(public svg: SVGSVGElement) {
        this.width = svg.clientWidth;
        this.height = svg.clientHeight;

        this.barCnt = 100;
        this.isPainted = false;
    }

    paint(data: number[], text: string) {
        this.isPainted = true;
    }

    clear() {
        const children = Array.prototype.slice.call(this.svg.children);
        children.forEach(node => {
            if (node.tagName !== 'defs') {
                this.svg.removeChild(node);
            }
        });;
    }

}
