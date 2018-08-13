const SVG_URL = 'http://www.w3.org/2000/svg';

export function createNode(tagName: string): SVGElement {
    return document.createElementNS(SVG_URL, tagName);
}
