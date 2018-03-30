import * as React from 'react';

export const PredictionPanel = ({predicted, predictions = [], fetching}) => {
  return <div>
    {fetching ? <span className="loader"></span> : undefined}
    {predictions.length && !fetching ? <div>
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
    </div> : null}
  </div>
};
