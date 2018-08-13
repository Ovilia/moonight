import rough from 'roughjs';
import { RoughSVG } from 'roughjs/bin/svg';

import { Painter } from './painter';
import { createNode } from '../util/svg';

export class SketchPainter extends Painter {

    rc: RoughSVG;

    constructor(svg: SVGSVGElement) {
        super(svg);

        this.barCnt = 160;
        this.rc = rough.svg(svg) as RoughSVG;
    }

    /**
     * @override
     */
    paint(data: number[]) {
        const size = Math.min(this.width, this.height);
        const groupWidth = size * 0.8;
        const outterR = groupWidth;
        const innerR = groupWidth * 0.3;
        const barCnt = data.length;
        const barSpaceAlpha = Math.PI * 2 / barCnt;
        const barMaxHeight = (outterR - innerR) / 2;
        const barPaddingAlpha = barSpaceAlpha * 0.2;

        this.clear();
        this._drawBackground();
        this._drawBars(data, innerR, barMaxHeight, barSpaceAlpha, barPaddingAlpha);
        this._drawText();

        super.paint(data);
    }


    protected _drawBars(
        data: number[],
        innerR: number,
        barMaxHeight: number,
        barSpaceAlpha: number,
        barPaddingAlpha: number
    ) {
        const cx = this.width / 2;
        const cy = this.height / 2;
        for (let i = 0; i < data.length; ++i) {
            const value = data[i] || 0;
            const rectHeight = Math.max(barMaxHeight * value, 4);
            const alpha = barSpaceAlpha * i;
            const cos0 = Math.cos(alpha - barPaddingAlpha);
            const sin0 = Math.sin(alpha - barPaddingAlpha);
            const cos1 = Math.cos(alpha + barPaddingAlpha);
            const sin1 = Math.sin(alpha + barPaddingAlpha);

            const bar = this.rc.polygon([
                [
                    cx + cos0 * (innerR),
                    cy + sin0 * (innerR)
                ],
                [
                    cx + cos0 * (innerR + rectHeight),
                    cy + sin0 * (innerR + rectHeight)
                ],
                [
                    cx + cos1 * (innerR + rectHeight),
                    cy + sin1 * (innerR + rectHeight)
                ],
                [
                    cx + cos1 * (innerR),
                    cy + sin1 * (innerR)
                ],
            ], {
                bowing: 2,
                hachureAngle: alpha * 180 / Math.PI + 30
            });

            this.svg.appendChild(bar);
        }
    }

    protected _drawText() {
        const text = createNode('text');
        text.setAttribute('x', this.width / 2 + '');
        text.setAttribute('y', this.height / 2 + '');
        text.setAttribute('fill', 'black');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'middle');
        text.style.font = '25px xiaowei';
        text.textContent = '今夜月色真美';
        this.svg.appendChild(text);
    }

    protected _drawBackground() {
    }

}
