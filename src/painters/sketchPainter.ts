import { titleSVGPath, titleSVGSize } from './../util/path/title';
import { recordingSVGPath, recordingSVGSize } from './../util/path/record';
import rough from 'roughjs';
import { RoughSVG } from 'roughjs/bin/svg';

import { Painter } from './painter';
import { createNode } from '../util/svg';

export class SketchPainter extends Painter {

    rc: RoughSVG;

    protected _innerR: number;
    protected _text: SVGElement;

    constructor(svg: SVGSVGElement) {
        super(svg);

        this.barCnt = 160;
        this.rc = rough.svg(svg) as RoughSVG;
        this._text = null;
    }

    /**
     * @override
     */
    paint(data: number[], text?: string) {
        const size = Math.min(this.width, this.height);
        const groupWidth = size * 0.5;
        const outterR = groupWidth * 0.9;
        const innerR = groupWidth * 0.45;
        this._innerR = innerR;
        const barCnt = data.length;
        const barSpaceAlpha = Math.PI * 2 / barCnt;
        const barMaxHeight = outterR - innerR;
        const barPaddingAlpha = barSpaceAlpha * 0.2;

        this.clear();
        this._drawBars(data, innerR, barMaxHeight, barSpaceAlpha, barPaddingAlpha);

        if (text) {
            this._drawText(text);
        }

        super.paint(data, text);
    }

    paintLoading() {
        this.clear();

        const displayWidth = this.width * 0.4;
        const recording = this._drawSVGText(
            recordingSVGPath,
            recordingSVGSize,
            displayWidth,
            'center',
            'middle'
        );
        this.svg.appendChild(recording);
    }

    paintTitle() {
        const displayWidth = this.width * 0.25;
        const title = this._drawSVGText(
            titleSVGPath,
            titleSVGSize,
            displayWidth,
            'center',
            'center'
        );
        this.svg.appendChild(title);
    }

    updateText(text: string) {
        if (this._text) {
            this.svg.removeChild(this._text);
        }
        this._drawText(text);
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
            const alpha = barSpaceAlpha * i + Math.PI;
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
                bowing: 3
            });

            this.svg.appendChild(bar);
        }

        const circle = this.rc.circle(cx, cy, innerR * 2 - 14, {
            roughness: 0.5
        });
        this.svg.appendChild(circle);
    }

    protected _drawText(words: string) {
        if (words.length < 1 || words.length > 9) {
            console.warn('Illegal word length');
            return;
        }

        const text = createNode('text') as SVGTextElement;

        text.onclick = () => {
            const msg = window.prompt('输入 1-9 个文字', '今夜月色真美');
            if (msg.length > 0 && msg.length < 10) {
                this.updateText(msg);
            }
            else {
                alert('文字应在 1-9 个字符');
            }
        };

        text.setAttribute('x', this.width / 2 + '');
        text.setAttribute('y', this.height / 2 + '');
        text.setAttribute('fill', 'black');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'central');
        text.textContent = words;
        this.svg.appendChild(text);

        const fontSizes = [80, 70, 46, 34, 28, 22, 20, 16, 14];
        const fontSize = fontSizes[words.length - 1];
        text.style.font = fontSize + 'px xiaowei';

        this._text = text;
    }

    protected _drawSVGText(
        svgPath: string,
        svgSize: number[],
        displayWidth: number,
        alignX: string,
        alignY: string,
        padding?: number
    ): SVGElement {
        const path = this.rc.path(svgPath, {
            fill: 'black',
            fillStyle: 'zigzag'
        });

        const scale = displayWidth / svgSize[0];
        const displayHeight = scale * svgSize[1];

        let x;
        if (alignX === 'left') {
            x = padding;
        }
        else if (alignX === 'right') {
            x = this.width - displayWidth - padding;
        }
        else {
            x = (this.width - displayWidth) / 2;
        }

        let y;
        if (alignY === 'top') {
            y = padding;
        }
        else if (alignY === 'bottom') {
            y = this.height - displayHeight - padding;
        }
        else {
            y = (this.height - displayHeight) / 2;
        }

        const translateStr = 'translate(' + x + ' ' + y + ')';
        const scaleStr = 'scale(' + scale + ')';
        path.setAttribute('transform', translateStr + ' ' + scaleStr);
        return path;
    }

}
