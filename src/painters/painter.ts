import { getSize } from '../util/svg';

export abstract class Painter {

    barCnt: number;

    // Canvas width and height
    width: number;
    height: number;

    isPainted: boolean;

    constructor(public svg: SVGSVGElement) {
        const size = getSize(svg, 400, 400);

        svg.setAttribute('width', size.width + '');
        svg.setAttribute('height', size.height + '');
        this.width = size.width;
        this.height = size.height;

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
