import { RoughSVG } from 'roughjs/bin/svg';
import { Button, ButtonStyle } from './button';

export class DownloadButton extends Button {

    constructor(public svg: SVGSVGElement, public rc: RoughSVG, style?: ButtonStyle) {
        super(svg, rc, style);
    }


    protected _drawIcon() {
        const diameter = (this.style.radius - this.style.padding) * 2 * 0.9;
        const radius = diameter / 2;
        const x = this.style.x;
        const y = this.style.y;
        const dy = this.isDown ? this.style.depth : 0;

        const icon = this.rc.linearPath([
            [x, y - radius],
            [x, y + radius]
        ]);
        this._svgGroup.appendChild(icon);
    }

}
