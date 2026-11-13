declare module 'jspdf' {
  export class jsPDF {
    constructor(options?: any);
    internal: any;
    addImage(imageData: any, format: string, x: number, y: number, width: number, height: number): void;
    setFillColor(r: number, g?: number, b?: number): void;
    roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string): void;
    rect(x: number, y: number, w: number, h: number, style?: string): void;
    setFont(fontName: string, fontStyle?: string): void;
    setFontSize(size: number): void;
    setTextColor(r: number, g?: number, b?: number): void;
    text(text: string, x: number, y: number, options?: any): void;
    output(type?: string): any;
    save(filename?: string): void;
    [key: string]: any;
  }
  const jsPDFDefault: typeof jsPDF;
  export default jsPDFDefault;
}

declare module 'html2canvas' {
  const html2canvas: any;
  export default html2canvas;
}
