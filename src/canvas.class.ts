import axios from 'axios';
import { Subject } from 'rxjs';

const predictUrl = `${process.env.api_url}/predict`;

export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  realWidth: number;
  realHeight: number;
  scale: number;
  isDrawing: boolean = false;

  private updateInfo = new Subject();
  updateInfo$ = this.updateInfo.asObservable();

  constructor(canvasElement: HTMLCanvasElement, width: number, height: number, scale: number) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.scale = scale;
    this.realWidth = width * scale;
    this.realHeight = height * scale;

    this.canvas.width = this.realWidth;
    this.canvas.height = this.realHeight;

    this.initCtx();
    this.bindEvents();
  }

  initCtx(): void {
    this.ctx.lineWidth = 1;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';

    this.ctx.scale(this.scale, this.scale);
  }

  bindEvents(): void {
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    this.canvas.addEventListener('mouseout', this.mouseUp.bind(this));
  }

  mouseMove(e): void {
    if (this.isDrawing) {
      const mousePos = this.getMousePosition(e);

      this.ctx.lineTo(mousePos.x, mousePos.y);
      this.ctx.stroke();
    }
  }

  mouseDown(e): void {
    const mousePos = this.getMousePosition(e);
    this.ctx.beginPath();
    this.ctx.moveTo(mousePos.x, mousePos.y);

    this.isDrawing = true
  }

  mouseUp(): void {
    this.isDrawing = false;
  }

  predict(): void {
    const imgd = this.ctx.getImageData(0, 0, this.realWidth, this.realWidth);
    const pix = imgd.data;
    const grayscaleImage = [];

    for (let i = 0, n = pix.length; i < n; i += 4) {
      grayscaleImage.push(pix[i + 3] / 255);
    }

    axios.post(predictUrl, {
      data: grayscaleImage,
      scale: this.scale
    }).then(res => this.emitPrediction(res.data.prediction[0]));
  }

  emitPrediction(predictions): void {
    const predicted = predictions.indexOf(Math.max.apply(null, predictions));
    const predictionsRounded = predictions.map(prediction => (prediction * 100).toFixed(2));
    this.updateInfo.next({predicted, predictions: predictionsRounded})
  }

  getMousePosition(e): any {
    const mouseX = e.pageX - this.getElementPos(this.canvas).left;
    const mouseY = e.pageY - this.getElementPos(this.canvas).top;
    return {
      x: Math.floor(mouseX / this.scale),
      y: Math.floor(mouseY / this.scale)
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getElementPos(obj) {
    let top = 0;
    let left = 0;
    while (obj && obj.tagName != 'BODY') {
      top += obj.offsetTop - obj.scrollTop;
      left += obj.offsetLeft - obj.scrollLeft;
      obj = obj.offsetParent;
    }
    return {
      top,
      left
    };
  }
}