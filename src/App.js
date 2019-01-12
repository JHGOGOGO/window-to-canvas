import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasLoc: {
        x: 0,
        y: 0
      },
      canvasContainerPoint: {
        leftTop: {
          x: 0,
          y: 0
        },
        rightTop: {
          x: 0,
          y: 0
        },
        leftBottom: {
          x: 0,
          y: 0
        },
        rightBottom: {
          x: 0,
          y: 0
        }
      }
    };

    this.init();
  }

  init = () => {
    this.width = 300;
    this.height = 300;
    this.canvasRef = React.createRef();
  };

  componentDidMount() {
    this.canvas = this.canvasRef && this.canvasRef.current;
    if (this.canvas) {
      this.ctx = this.initCanvas(this.canvas);
      const canvasContainerPoint = this.getCanvasContainerPoint(this.canvas);
      console.log('this.canvasContainerPoint:', canvasContainerPoint);
      this.setState({
        canvasContainerPoint
      });
    }
  }

  initCanvas = canvas => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const { width, height } = this;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.style.background = '#fff';
    const ctx = canvas && canvas.getContext('2d');
    // 缩放处理
    ctx.scale(devicePixelRatio, devicePixelRatio);

    return ctx;
  };

  getCanvasContainerPoint(canvas) {
    const canvasBox = canvas.getBoundingClientRect();
    const { left = 0, top = 0, width = 1, height = 1 } = canvasBox;

    return {
      leftTop: {
        x: left,
        y: top
      },
      rightTop: {
        x: left + width,
        y: top
      },
      leftBottom: {
        x: left,
        y: top + height
      },
      rightBottom: {
        x: left + width,
        y: top + height
      }
    };
  }

  windowToCanvas(canvas, x, y) {
    const canvasBox = canvas.getBoundingClientRect();
    const { width: canvasWidth, height: canvasHeight } = canvas;
    const { left = 0, top = 0, width = 1, height = 1 } = canvasBox;
    // 1.画布进行了缩放处理
    const windowX = x - left;
    const windowY = y - top;

    // 2.画布没进行了缩放处理
    // const windowX = (x - left) * (canvasWidth / width);
    // const windowY = (y - top) * (canvasHeight / height);

    return {
      x: windowX,
      y: windowY
    };
  }

  getTouchLocation(e) {
    const touch = e.touches && e.touches[0];

    return {
      x: touch.pageX,
      y: touch.pageY
    };
  }

  handleCanvasContainerTouchMove = e => {
    const { canvas, ctx } = this;
    const { width = 0, height = 0 } = canvas;
    const { x = 0, y = 0 } = this.getTouchLocation(e);
    const canvasLoc = this.windowToCanvas(canvas, x, y);
    this.setState({
      canvasLoc: {
        x: canvasLoc.x,
        y: canvasLoc.y
      }
    });
    ctx.clearRect(0, 0, width, height);
    this.renderLocationLine(ctx, width, height, canvasLoc);
    this.renderCirclePoint(ctx, canvasLoc);
  };

  renderLocationLine = (ctx, width, height, canvasLoc) => {
    ctx.save();
    ctx.strokeStyle = '#778899';
    ctx.lineWidth = 4;
    this.renderHorizontalLine(ctx, width, canvasLoc);
    this.renderVerticalLine(ctx, height, canvasLoc);
    ctx.restore();
  };

  renderHorizontalLine(ctx, width, canvasLoc) {
    const { y = 0 } = canvasLoc;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.closePath();
    ctx.stroke();
  }

  renderVerticalLine(ctx, height, canvasLoc) {
    const { x = 0 } = canvasLoc;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.closePath();
    ctx.stroke();
  }

  renderCirclePoint(ctx, canvasLoc) {
    const { x = 0, y = 0 } = canvasLoc;
    const r = 8;
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  render() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const { canvasLoc, canvasContainerPoint } = this.state;
    const { leftTop, rightTop, leftBottom, rightBottom } = canvasContainerPoint;
    let { x = 0, y = 0 } = canvasLoc;
    x = x.toFixed(2);
    y = y.toFixed(2);

    return (
      <div className='app-container'>
        <div className='text'>{`client's dpr: ${devicePixelRatio}`}</div>
        <div className='text'>{`canvas's location: x: ${x}, y: ${y}`}</div>
        <div className='text'>canvas container's points:</div>
        <div className='text-connect'>
          {`「(${leftTop.x}, ${leftTop.y})，(${rightTop.x}, ${rightTop.y})」`}
        </div>
        <div className='text-connect'>
          {`「(${leftBottom.x}, ${leftBottom.y})，(${rightBottom.x}, ${
            rightBottom.y
          })」`}
        </div>
        <div className='canvas-container'>
          <canvas
            ref={this.canvasRef}
            onTouchMove={this.handleCanvasContainerTouchMove}
          />
          <div className='decorate' />
        </div>
        <div className='text-connect'>
          square：300 * 300
        </div>
      </div>
    );
  }
}

export default App;
