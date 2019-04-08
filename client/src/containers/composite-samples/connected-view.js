import React, { Component } from 'react';

import { connect } from 'react-redux';

import { TIMESERIE_NODE, SAMPLE_NODE } from '../../nodes/sow8/hierarchy';

import { getSamples, fetchSamples, fetchTimeSerie } from '../../redux/ducks/composites';

import { parseUrlMatch } from '../../nodes';
import NotFoundPage from '../../components/notFound.js';
import CompositeViewContainer from './view';

import {
  identity,
  setSerialize,
  setDeserialize,
  defaultWrapper,
  onParamChanged,
  updateParams
} from '../../utils/url-props';

const URL_PARAMS = {
  platemapId: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  runId: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  selectedSampleKeys: {
    serialize: defaultWrapper(setSerialize, '[]'),
    deserialize: defaultWrapper(setDeserialize, new Set())
  },
  plots: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'raw'),
    callback: function(currValue, nextValue) {
      const { selectedSampleKeys } = this.props;
      for (let _id of selectedSampleKeys.values()) {
        this.fetchSampleTimeSeries({_id}, nextValue);
      }
    }
  }
}

class CompositeSamplesContainer extends Component {

  constructor(props) {
    super(props);
    this.onParamChanged = onParamChanged.bind(this);
    this.updateParams = updateParams.bind(this);
  }

  componentDidMount() {
    const { dispatch, ancestors, item, platemapId, runId, selectedSampleKeys, plots } = this.props;
    dispatch(fetchSamples({ancestors, item, platemapId, runId}));
    for (let _id of selectedSampleKeys.values()) {
      this.fetchSampleTimeSeries({_id}, plots);
    }
  }

  onSampleSelectById = (id) => {
    const { samples, selectedSampleKeys } = this.props;
    const matches = samples.filter((s) => s.sampleNum == id);
    if (matches.length === 0) {
      return;
    }

    const sample = matches[0];

    if (selectedSampleKeys.has(sample._id)) {
      return;
    }

    this.onSampleSelect(sample);
  }

  onClearSelection = () => {
    this.onParamChanged('selectedSampleKeys', new Set());
  }

  onSampleSelect = (sample) => {
    const { plots } = this.props;
    this.fetchSampleTimeSeries(sample, plots);
    const selectedSampleKeys = new Set(this.props['selectedSampleKeys']);
    selectedSampleKeys.add(sample._id);
    this.onParamChanged('selectedSampleKeys', selectedSampleKeys);
  }

  onSampleDeselect = (sample) => {
    const selectedSampleKeys = new Set(this.props['selectedSampleKeys']);
    selectedSampleKeys.delete(sample._id);
    this.onParamChanged('selectedSampleKeys', selectedSampleKeys);
  }

  fetchSampleTimeSeries = (sample, plots) => {
    const { ancestors, item, dispatch, runId } = this.props;
    const ancestors_ = [...ancestors, item, {type: SAMPLE_NODE, _id: sample._id}];
    const item_ = {type: TIMESERIE_NODE};
    const fetchRaw = plots.includes('raw');
    const fetchFitted = plots.includes('fitted');
    if (fetchRaw) {
      dispatch(fetchTimeSerie({ancestors: ancestors_, item: item_, runId, fitted: false}));
    }
    if (fetchFitted) {
      dispatch(fetchTimeSerie({ancestors: ancestors_, item: item_, runId, fitted: true}));
    }
  }

  getUrlParams() {
    return URL_PARAMS;
  }

  render() {
    const {
      samples,
      selectedSamples,
      selectedSampleKeys,
    } = this.props;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    return (
      <CompositeViewContainer
        {...this.props}
        samples={samples}
        selectedSamples={selectedSamples}
        selectedSampleKeys={selectedSampleKeys}
        onSampleSelect={this.onSampleSelect}
        onSampleDeselect={this.onSampleDeselect}
        onSampleSelectById={this.onSampleSelectById}
        onClearSelection={this.onClearSelection}
        showDetails={true}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const ancestors = parseUrlMatch(ownProps.match);
  const item = ancestors.pop();
  const props = {
    ancestors,
    item
  }
  const searchParams = new URLSearchParams(ownProps.location.search);

  for (let key in URL_PARAMS) {
    props[key] = URL_PARAMS[key].deserialize(searchParams.get(key));
  }

  const samples = getSamples(state, props['platemapId'], props['runId']) || [];
  const selectedSamples = samples.filter(el => props['selectedSampleKeys'].has(el._id));

  props['samples'] = samples;
  props['selectedSamples'] = selectedSamples;
  return props;
}

export default connect(mapStateToProps)(CompositeSamplesContainer);