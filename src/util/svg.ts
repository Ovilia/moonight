const SVG_URL = 'http://www.w3.org/2000/svg';

export function createNode(tagName: string): SVGElement {
    return document.createElementNS(SVG_URL, tagName);
}

export function getSize(
    svg: SVGSVGElement,
    defaultWidth: number,
    defaultHeight: number
) {
    const bbox = svg.getBBox();
    return {
        width: bbox.width || Math.min(defaultWidth, window.innerWidth),
        height: bbox.height || defaultHeight
    };
}

export function svgToCanvas(svg: SVGSVGElement, scale: number)
    : Promise<HTMLCanvasElement>
{
    const width = +svg.getAttribute('width');
    const height = +svg.getAttribute('height');

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    svg.setAttribute('xmlns', SVG_URL);

    const img = new Image();

    return new Promise((resolve, reject) => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height, 0, 0,
                width * scale, height * scale);
            resolve(canvas);
        };

        img.onerror = err => {
            alert('保存图片失败，建议使用截图生成图片。');
            reject(err);
        };

        img.src = 'data:image/svg+xml,' + encodeURIComponent(svg.outerHTML);
    });
}
