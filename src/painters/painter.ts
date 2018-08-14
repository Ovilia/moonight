import { getDpr } from '../util/device';
import { saveSvgAsPng } from 'save-svg-as-png';

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

    saveImage(width?: number, height?: number) {
        this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const svgData = this.svg.outerHTML;
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        const svgBlob = new Blob([preface, svgData], {
            type: 'image/svg+xml;charset=utf-8'
        });
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

}
