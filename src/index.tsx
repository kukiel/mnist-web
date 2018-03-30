import './style.css';
import * as React from 'react';
import { render } from 'react-dom'
import { Canvas } from './canvas.class';
import { ActionsPanel } from './components/ActionsPanel';
import { PredictionPanel } from './components/PredictionsPanel';

const canvasElement = document.querySelector('.canvas') as HTMLCanvasElement;
const canvas = new Canvas(canvasElement, 28, 28, 3);
let predictions = undefined;
let predicted = undefined;
let fetching = false;

canvas.updatePrediction$.subscribe(onNewPrediction);

const Container = () => {
  return <div>
    <ActionsPanel clear={clear} predict={getPrediction}/>
    <PredictionPanel fetching={fetching} predicted={predicted} predictions={predictions}/>
  </div>
};

function getPrediction(type) {
  fetching = true;
  canvas.predict(type);
  renderDOM();
}

function onNewPrediction(data: any) {
  predictions = data.predictions;
  predicted = data.predicted;
  fetching = false;
  renderDOM();
}

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
