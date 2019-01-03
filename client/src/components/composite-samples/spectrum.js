import React, { Component } from 'react';
import { Spectrum } from 'composition-plot';

import {
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core';
import { Slider} from '@material-ui/lab';

class SpectrumComponent extends Component {
  spectraElement;

  constructor(props) {
    super(props);
    this.state = {
      sampleFields: [],
      yOffset: 0
    };
  }

  componentDidMount() {
    this.spectraPlot = new Spectrum(this.spectraElement);
    this.spectraPlot.setOffset(this.state.yOffset);
    this.updateSpectra();
  }

  componentDidUpdate(prevProps) {
    if (this.props.timeseries.length !== prevProps.timeseries.length) {
      this.updateSpectra();
    }
  }

  updateSpectra() {
    const { timeseries, onParamChanged } = this.props;
    let { xAxisS, yAxisS } = this.props;
    this.spectraPlot.setSpectra(this.props.timeseries);
    if (timeseries.length > 0) {
      const spectrum = timeseries[0].spectrum;
      const sampleFields = Object.keys(spectrum);
      if (!(xAxisS in spectrum)) {
        xAxisS = sampleFields[0];
      }
      if (!(yAxisS in spectrum)) {
        yAxisS = sampleFields[1];
      }
      this.spectraPlot.setAxes(xAxisS, yAxisS);
      this.setState({sampleFields});
      onParamChanged({xAxisS, yAxisS});
    }
  }

  onSampleFieldChange(field, index) {
    let { xAxisS, yAxisS, onParamChanged } = this.props;
    if (index === 0) {
      xAxisS = field;
    } else {
      yAxisS = field;
    }
    this.spectraPlot.setAxes(xAxisS, yAxisS);
    onParamChanged({xAxisS, yAxisS});
  }

  onOffsetChange(yOffset) {
    this.spectraPlot.setOffset(yOffset);
    this.setState({yOffset});
  }

  render() {
    const { visSelector, xAxisS, yAxisS } = this.props;
    let sampleFieldsSelectOptions = [];
    for (let name of this.state.sampleFields) {
      sampleFieldsSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              {visSelector &&
              <TableCell>Display</TableCell>
              }
              <TableCell>X Axis</TableCell>
              <TableCell>Y Axis</TableCell>
              <TableCell>Offset</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {visSelector &&
              <TableCell>
                <FormControl fullWidth>
                  {visSelector}
                </FormControl>
              </TableCell>
              }
              <TableCell>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor="select-scalar">Scalar</InputLabel> */}
                  <Select
                    value={xAxisS || ""}
                    onChange={(e) => {this.onSampleFieldChange(e.target.value, 0)}}
                    inputProps={{name: 'scalar', id: 'select-scalar'}}
                  >
                    {sampleFieldsSelectOptions}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor="select-map">Color Map</InputLabel> */}
                  <Select
                    value={yAxisS || ""}
                    onChange={(e) => {this.onSampleFieldChange(e.target.value, 1)}}
                    inputProps={{name: 'colorMap', id: 'select-map'}}
                  >
                    {sampleFieldsSelectOptions}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                  <div>
                    {this.state.yOffset.toFixed(3)}
                  </div>
                  <div style={{flexGrow: 1, paddingRight: 16}}>
                    <Slider 
                      min={0} max={10} step={0.1}
                      value={this.state.yOffset}
                      onChange={(e, val) => {this.onOffsetChange(val)}}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div style={{width: '100%', height: '40rem', position: 'relative'}}>
          <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.spectraElement = ref;}}></svg>
        </div>
      </div>
    );
  }
}

export default SpectrumComponent;
