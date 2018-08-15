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
