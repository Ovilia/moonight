import { RoughSVG } from 'roughjs/bin/svg';
import { Button, ButtonStyle } from './button';

export class RecordButton extends Button {

    constructor(public svg: SVGSVGElement, public rc: RoughSVG, style?: ButtonStyle) {
        super(svg, rc, style);
    }


    protected _drawIcon() {
        const diameter = (this.style.radius - this.style.padding) * 2 * 0.9;
        const dy = this.isDown ? this.style.depth : 0;
        const icon = this.rc.circle(this.style.x, this.style.y + dy, diameter, {
            fill: 'black',
            fillStyle: 'zigzag'
        });
        this._svgGroup.appendChild(icon);
    }

}
