import { RoughSVG } from 'roughjs/bin/svg';
import rough from 'roughjs';

import { Button } from './buttons/button';

export class GuiManager {

    width: number;
    height: number;

    btnRadius: number;
    btnMargin: number;

    buttons: Button[];

    rc: RoughSVG;

    constructor(public svg: SVGSVGElement) {
        this.buttons = [];

        this.width = svg.clientWidth;
        this.height = svg.clientHeight;

        this.btnRadius = 25;
        this.btnMargin = 10;

        this.rc = rough.svg(svg) as any;
    }

    addButton(button: Button, index?: number) {
        if (index == null) {
            index = this.buttons.length;
        }
        this.buttons.splice(index, 0, button);

        this._renderButtons();

        button.setDown(false);
        button.show();
    }

    removeButton(button: Button) {
        if (!button) {
            return;
        }

        for (let i = 0; i < this.buttons.length; ++i) {
            if (this.buttons[i] === button) {
                this.buttons.splice(i, 1);
                button.hide();
                this._renderButtons();
                return;
            }
        }
    }


    protected _renderButtons() {
        const cnt = this.buttons.length;
        const btnSpan = (this.btnRadius + this.btnMargin) * 2;
        const totalWidth = btnSpan * cnt;
        const marginLeft = (this.width - totalWidth) / 2;

        for (let i = 0; i < cnt; ++i) {
            this.buttons[i].setStyle({
                x: marginLeft + btnSpan * i + this.btnRadius,
                y: this.height / 2
            });
        }
    }

}
