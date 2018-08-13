import { RoughSVG } from 'roughjs/bin/svg';
import { Button, ButtonStyle } from './button';
import { createNode } from '../../util/svg';

export class OpenButton extends Button {

    constructor(public svg: SVGSVGElement, public rc: RoughSVG, style?: ButtonStyle) {
        super(svg, rc, style);
    }


    protected _drawIcon() {
        const x = this.style.x;
        const y = this.style.y;
        const radius = this.style.radius - this.style.padding;
        const diameter = radius * 2;
        const dy = this.isDown ? this.style.depth : 0;

        const group = createNode('g');
        const dx = x - radius + diameter / 10;
        group.setAttribute('transform',
            'translate(' + dx + ' ' + (y + dy - radius) + ')');

        const bg = this.rc.polygon(
            [
                [0, diameter / 6],
                [radius / 3 * 4, diameter / 6],
                [radius / 3 * 4, diameter],
                [0, diameter]
            ], {
                fill: 'black',
                fillStyle: 'zigzag'
            }
        );
        group.appendChild(bg);

        const front = this.rc.polygon(
            [
                [0, diameter],
                [radius / 3 * 2, radius],
                [diameter, radius],
                [radius / 3 * 4, diameter]
            ],
            {
                fill: 'white',
                fillStyle: 'solid'
            }
        );
        group.appendChild(front);

        this._svgGroup.appendChild(group);
    }

}
