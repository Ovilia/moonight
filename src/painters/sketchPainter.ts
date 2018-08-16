import { qrCodeImage } from './../util/qr';
import { titleSVGPath, titleSVGSize } from './../util/path/title';
import { recordingSVGPath, recordingSVGSize } from './../util/path/record';
import rough from 'roughjs';
import { RoughSVG } from 'roughjs/bin/svg';

import { Painter } from './painter';
import { createNode, svgToCanvas } from '../util/svg';
import { isMobile } from '../util/device';

export class SketchPainter extends Painter {

    rc: RoughSVG;

    protected _innerR: number;
    protected _text: SVGElement;
    protected _textStr: string;
    protected _title: SVGElement;

    constructor(svg: SVGSVGElement) {
        super(svg);

        this.barCnt = 160;
        this.rc = rough.svg(svg) as RoughSVG;
        this._text = null;
        this._textStr = '';
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
        this._title = title;
    }

    updateText(text: string) {
        if (this._text) {
            this.svg.removeChild(this._text);
        }
        this._drawText(text);
    }

    exportImage() {
        const mobile = isMobile();

        const outSvg = document.createElement('svg') as any;
        outSvg.setAttribute('width', '400');
        outSvg.setAttribute('height', '600');

        // Remove text since font is not converted fron svg to canvas
        if (this._text) {
            this.svg.removeChild(this._text);
            // Not setting this._text to null so that it can be accessed in
            // _wrapCanvas
        }

        const contentGroup = createNode('g');
        contentGroup.innerHTML = this.svg.innerHTML;
        contentGroup.setAttribute('transform', 'translate(0, 90)');
        outSvg.appendChild(contentGroup);

        const dpr = 2;
        svgToCanvas(outSvg, dpr).then(canvas => {
                this._wrapCanvas(canvas, dpr)
                    .then(() => {
                        const base64 = canvas.toDataURL('image/png');

                        if (mobile) {
                            const img = document.createElement('img');
                            img.setAttribute('src', base64);
                            img.setAttribute('class', 'full-img');

                            const oldSvg = document.getElementsByTagName('svg');
                            const len = oldSvg.length;
                            for (let i = 0; i < len; ++i) {
                                document.body.removeChild(oldSvg[0]);
                            }
                            document.body.appendChild(img);

                            const hint = document.getElementById('hint');
                            hint.style.display = 'block';
                        }
                        else {
                            const a = document.createElement('a');
                            a.download = 'moonight.png';
                            a.href = base64.replace(/^data:image\/[^;]/,
                                'data:application/octet-stream');
                            a.click();
                            this.svg.appendChild(this._text);
                        }
                    });
        });
    }


    protected _wrapCanvas(canvas: HTMLCanvasElement, dpr: number)
        : Promise<void>
    {
        const ctx = canvas.getContext('2d');
        const rc = rough.canvas(canvas);

        // yue ye title
        const titleScale = dpr * 0.4;
        ctx.save();
        ctx.translate(25 * dpr, 505 * dpr);
        ctx.scale(titleScale, titleScale);
        rc.path(titleSVGPath, {
            fill: 'black',
            fillStyle: 'zigzag'
        });
        ctx.restore();

        // github
        ctx.font = '22px Arial, sans-serif';
        ctx.fillStyle = '#777';
        ctx.fillText('https://umeecorn.com/moonight', 25 * dpr, 560 * dpr);
        ctx.fillText('GitHub: Ovilia/moonight', 25 * dpr, 575 * dpr);

        // text in the center
        const fontSize = parseInt(this._text.style.font, 10);
        ctx.font = fontSize * dpr + 'px xiaowei';
        const x = +this._text.getAttribute('x');
        const y = +this._text.getAttribute('y') + 90;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this._textStr, x * dpr, y * dpr);

        // qr
        const qrImg = new Image();
        return new Promise((resolve, reject) => {
            qrImg.onload = () => {
                ctx.drawImage(qrImg, 310 * dpr, 510 * dpr, 70 * dpr, 70 * dpr);
                resolve();
            };
            qrImg.onerror = () => {
                reject();
            };
            qrImg.src = qrCodeImage;
        });
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

        const fontSizes = [80, 64, 46, 34, 28, 22, 20, 16, 14];
        const fontSize = fontSizes[words.length - 1];
        text.style.font = fontSize + 'px xiaowei';

        this._text = text;
        this._textStr = words;
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
            fillStyle: 'zigzag',
            roughness: 0.8
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
