import React, { Component } from 'react';

import {
  Select,
  MenuItem
} from '@material-ui/core';

import SpectrumComponent from './spectrum';
import HeatMapComponent from './heatmap';

class SamplesDetails extends Component {

  render() {
    const { display, plots, onParamChanged } = this.props;
    const visSelector = (
      <Select value={display} onChange={(e) => { onParamChanged('display', e.target.value)}}>
        <MenuItem value={'spectrum'}>Spectrum</MenuItem>
        <MenuItem value={'heatmap'}>Heatmap</MenuItem>
      </Select>
    );

    const  _detailSelector = (
      <Select value={plots} onChange={(e) => { onParamChanged('plots', e.target.value)}}>
        <MenuItem value={'fitted'}>Fitted Data</MenuItem>
        <MenuItem value={'raw'}>Raw Data</MenuItem>
        <MenuItem value={'raw+fitted'}>Raw+Fitted Data</MenuItem>
      </Select>
    );

    return (
      <div>
        {display === 'spectrum' &&
          <SpectrumComponent {...this.props} visSelector={visSelector} detailSelector={null} />
        }
        {display === 'heatmap' &&
          <HeatMapComponent {...this.props} visSelector={visSelector} detailSelector={null} />
        }
      </div>
    );
  }
}

export default SamplesDetails;
