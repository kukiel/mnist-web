import * as React from 'react';

export const ActionsPanel = ({predict, clear}) => {
  return <div>
    <button onClick={() => predict()}>Predict</button>
    <button onClick={() => clear()}>Clear</button>
  </div>
};

export const PredictionPanel = ({predicted, predictions = []}) => {
  return predictions.length ? <div>
    <h3>It's {predicted} ({predictions[predicted]}%)</h3>
    <table>
      <tbody>
      <tr>
        {predictions.map((prediction, i) =>
          <td key={i}>{i}</td>
        )}
      </tr>
      <tr>
        {predictions.map((prediction, i) =>
          <td key={i}>{prediction}%</td>
        )}
      </tr>
      </tbody>
    </table>
  </div> : null;
};
