import { RoughSVG } from 'roughjs/bin/svg';
import { Button, ButtonStyle } from './button';
import { createNode } from '../../util/svg';

export class CancelButton extends Button {

    constructor(public svg: SVGSVGElement, public rc: RoughSVG, style?: ButtonStyle) {
        super(svg, rc, style);
    }


    protected _drawIcon() {
        const diameter = (this.style.radius - this.style.padding) * 2;
        const dy = this.isDown ? this.style.depth : 0;

        const group = createNode('g');
        group.setAttribute('transform', 'rotate(45)');
        group.setAttribute('transform-origin', this.style.x + ' ' + this.style.y);

        const width = diameter;
        const height = diameter * 0.2;

        const vertical = this.rc.rectangle(
            this.style.x - width / 2,
            this.style.y + dy - height / 2,
            width,
            height,
            {
                fill: 'black',
                fillStyle: 'zigzag'
            }
        );
        group.appendChild(vertical);

        const horizontal = this.rc.rectangle(
            this.style.x - height / 2,
            this.style.y + dy - width / 2,
            height,
            width,
            {
                fill: 'black',
                fillStyle: 'zigzag'
            }
        );
        group.appendChild(horizontal);

        this._svgGroup.appendChild(group);
    }

}
