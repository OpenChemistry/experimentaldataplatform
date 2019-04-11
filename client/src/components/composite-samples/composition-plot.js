import React, { Fragment } from 'react';

import QuaternaryPlot from './quaternary-plot';
import MultidimensionalPlot from './multidimension-plot';

export default (props) => {
  const {
    compositionPlot
  } = props;

  return (
    <Fragment>
      {compositionPlot === '2d' &&
      <QuaternaryPlot {...props}/>
      }
      {compositionPlot === '3d' &&
      <MultidimensionalPlot {...props}/>
      }
    </Fragment>
  );
}