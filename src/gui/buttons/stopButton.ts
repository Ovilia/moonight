import { RoughSVG } from 'roughjs/bin/svg';
import { Button, ButtonStyle } from './button';

export class StopButton extends Button {

    constructor(public svg: SVGSVGElement, public rc: RoughSVG, style?: ButtonStyle) {
        super(svg, rc, style);
    }


    protected _drawIcon() {
        const diameter = (this.style.radius - this.style.padding) * 2 * 0.8;
        const dy = this.isDown ? this.style.depth : 0;
        const icon = this.rc.rectangle(
            this.style.x - diameter / 2,
            this.style.y + dy - diameter / 2,
            diameter,
            diameter,
            {
                fill: 'black',
                fillStyle: 'zigzag'
            }
        );
        this._svgGroup.appendChild(icon);
    }

}
