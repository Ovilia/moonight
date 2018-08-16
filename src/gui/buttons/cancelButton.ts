import { RoughSVG } from 'roughjs/bin/svg';
import { Button, ButtonStyle } from './button';
import { createNode } from '../../util/svg';

export class CancelButton extends Button {

    constructor(public svg: SVGSVGElement, public rc: RoughSVG, style?: ButtonStyle) {
        super(svg, rc, style);
    }


    protected _drawIcon() {
        const diameter = (this.style.radius - this.style.padding) * 2 * 0.8;
        const dy = this.isDown ? this.style.depth : 0;

        const path1 = this.rc.linearPath([
            [this.style.x - diameter / 2, this.style.y - diameter / 2 + dy],
            [this.style.x + diameter / 2, this.style.y + diameter / 2 + dy]
        ]);
        this._svgGroup.appendChild(path1);

        const path2 = this.rc.linearPath([
            [this.style.x - diameter / 2, this.style.y + diameter / 2 + dy],
            [this.style.x + diameter / 2, this.style.y - diameter / 2 + dy]
        ]);
        this._svgGroup.appendChild(path2);
    }

}
