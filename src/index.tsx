import './style.css';
import * as React from 'react';
import { render } from 'react-dom'
import { Canvas } from './canvas.class';
import { ActionsPanel, PredictionPanel } from './components';

const canvasElement = document.querySelector('.canvas') as HTMLCanvasElement;
const canvas = new Canvas(canvasElement, 28, 28, 3);
let predictions = undefined;
let predicted = undefined;

canvas.updateInfo$.subscribe((data: any) => {
  predictions = data.predictions;
  predicted = data.predicted;
  renderDOM();
});

const Container = () => {
  return <div>
    <ActionsPanel clear={clear} predict={() => canvas.predict()}/>
    <PredictionPanel predicted={predicted} predictions={predictions}/>
  </div>
};

function clear() {
  canvas.clearCanvas();
  predictions = [];
  predicted = undefined;
  renderDOM();
}

function renderDOM() {
  render(
    <Container/>,
    document.querySelector('.panel')
  );
}

renderDOM();
