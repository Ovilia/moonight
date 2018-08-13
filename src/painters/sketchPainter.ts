import rough from 'roughjs';
import { RoughSVG } from 'roughjs/bin/svg';

import { Painter } from './painter';

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
        const groupWidth = this.width * 0.9;
        const outterR = groupWidth * 0.7;
        const innerR = groupWidth * 0.4;
        const barCnt = data.length;
        const barSpaceAlpha = Math.PI * 2 / barCnt;
        const barMaxHeight = (outterR - innerR) / 2;

        this._drawBackground();
        this._drawBars(data, innerR, barMaxHeight, barSpaceAlpha);
        this._drawText();

        super.paint(data);
    }

    protected _drawBars(
        data: number[],
        innerR: number,
        barMaxHeight: number,
        barSpaceAlpha: number
    ) {
        const cx = this.width / 2;
        const cy = this.height / 2;
        for (let i = 0; i < data.length; ++i) {
            const value = data[i] || 0;
            const rectHeight = Math.max(barMaxHeight * value, 4);
            const alpha = barSpaceAlpha * i;
            const cos = Math.cos(alpha);
            const sin = Math.sin(alpha);

            this.rc.line(
                cx + cos * (innerR - rectHeight),
                cy + sin * (innerR - rectHeight),
                cx + cos * (innerR + rectHeight),
                cy + sin * (innerR + rectHeight), {
                    roughness: 3,
                    strokeWidth: 3
                }
            );
        }

        this.rc.circle(cx, cy, innerR * 2, {
            roughness: 1,
            strokeWidth: 3
        });
    }

    protected _drawText() {
        // this._ctx.font = '55px xiaowei';
        // this._ctx.textAlign = 'center';
        // this._ctx.textBaseline = 'middle';
        // this._ctx.fillText('今夜月色真美', this.width / 2, this.height / 2);
    }

    protected _drawBackground() {
    }

}
