import { RoughSVG } from 'roughjs/bin/svg';
import { createNode } from '../../util/svg';

export class Button {

    static defaultStyle: ButtonStyle = {
        x: 0,
        y: 0,
        radius: 25,
        padding: 10,
        depth: 8
    };

    style: ButtonStyle;

    isDown: boolean;
    isShow: boolean;

    protected _svgGroup: SVGGElement;
    protected _onClick: Function;
    protected _isDirty: boolean;


    constructor(public svg: SVGSVGElement, public rc: RoughSVG, style?: ButtonStyle) {
        this.isDown = false;

        this._svgGroup = createNode('g') as SVGGElement;
        this.svg.appendChild(this._svgGroup);

        this.isShow = false;

        if (style) {
            this.setStyle(style);
        }
        else {
            this.style = Button.defaultStyle;
        }

        this._initEvent();
    }


    show() {
        this.isShow = true;
        this._svgGroup.style.visibility = 'visible';
        this.redraw();
    }

    hide() {
        this.isShow = false;
        this._svgGroup.style.visibility = 'hidden';
    }

    redraw() {
        if (this.isShow && this._isDirty) {
            this.clear();
            this._drawBackground();
            this._drawIcon();
            this._setClickable();
        }
        else {
            this._isDirty = true;
        }
    }

    setDown(isDown: boolean) {
        if (this.isDown !== isDown) {
            this.isDown = isDown;
            this.redraw();
        }
    }

    setStyle(style: ButtonStyle) {
        this.style = Object.assign({}, Button.defaultStyle, this.style, style);
        this.redraw();
    }

    clear() {
        this._svgGroup.innerHTML = '';
    }

    onclick(callback: Function) {
        this._onClick = callback;
    }


    protected _drawIcon() {}

    protected _drawBackground() {
        const x = this.style.x;
        const y = this.style.y;
        const diameter = this.style.radius * 2;
        const depth = this.style.depth;

        if (!this.isDown) {
            const arc = this.rc.arc(x, y + depth, diameter,
                diameter, 0, Math.PI, true, {
                    fill: 'black',
                    fillStyle: 'zigzag'
                });
            this._svgGroup.appendChild(arc);

            const left = this.rc.line(x - this.style.radius, y,
                x - this.style.radius, y + depth, {
                    roughness: 0.2
                });
            this._svgGroup.appendChild(left);

            const right = this.rc.line(x + this.style.radius, y,
                x + this.style.radius, y + depth, {
                    roughness: 0.2
                });
            this._svgGroup.appendChild(right);

            const bg = this.rc.circle(x, y, diameter, {
                fill: 'white',
                fillStyle: 'solid'
            });
            this._svgGroup.appendChild(bg);
        }
        else {
            const bg = this.rc.circle(x, y + depth, diameter);
            this._svgGroup.appendChild(bg);
        }
    }

    protected _initEvent() {
        this._svgGroup.addEventListener('mousedown', () => {
            console.log('mousedown');
            this.setDown(true)
        });
        this._svgGroup.addEventListener('mouseup', event => {
            console.log('mouseup');

            if (typeof this._onClick === 'function') {
                this._onClick(event);
            }

            this.setDown(false);
        });
    }

    protected _setClickable() {
        const children = this._svgGroup.children;
        for (let i = 0; i < children.length; ++i) {
            children[i].setAttribute('pointer-events', 'visible');
        }
    }

}

export interface ButtonStyle {
    x?: number,
    y?: number,
    radius?: number,
    padding?: number,
    depth?: number
}
