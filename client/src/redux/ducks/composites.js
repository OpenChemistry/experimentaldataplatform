import { createAction, handleActions } from 'redux-actions';
import { ArrayDataProvider, SplineDataProvider } from 'composition-plot/dist/data-provider/spectrum';

const initialState = {
  samples: [],
  timeseries: {},
  fittedTimeseries: {}
}

// Selectors
export const getSamples = (state, platemapId, runId) => {
  return state.composites.samples.filter(val => val.platemapId === platemapId);
}

export const getTimeSerie = (state, sampleId, fitted) => {
  if (fitted) {
    return state.composites.fittedTimeseries[sampleId];
  } else {
    return state.composites.timeseries[sampleId];
  }
}

// Actions

export const FETCH_SAMPLES_REQUESTED = 'FETCH_SAMPLES_REQUESTED';
export const FETCH_SAMPLES_SUCCEEDED = 'FETCH_SAMPLES_SUCCEEDED';
export const FETCH_SAMPLES_FAILED = 'FETCH_SAMPLES_FAILED';

export const FETCH_TIMESERIE_REQUESTED = 'FETCH_TIMESERIE_REQUESTED';
export const FETCH_TIMESERIE_SUCCEEDED = 'FETCH_TIMESERIE_SUCCEEDED';
export const FETCH_TIMESERIE_FAILED = 'FETCH_TIMESERIE_FAILED';

// Action creators

export const fetchSamples = createAction(FETCH_SAMPLES_REQUESTED);
export const fetchTimeSerie = createAction(FETCH_TIMESERIE_REQUESTED);

// Reducer

function patchSample(sample, platemapId, runId) {
  sample.platemapId = platemapId;
  sample.runId = runId;
  sample.composition = sample.composition.elements.reduce((total, element, i) => {
    total[element] = sample.composition.amounts[i];
    return total;
  }, {});
  return sample;
}

function toArrayProvider(timeseries) {
  const provider = new ArrayDataProvider();
  timeseries.forEach(ts => {
    const { technique, data } = ts;
    Object.entries(data).forEach(([key, value]) => {
      provider.setArray(`${key} - ${technique}`, value);
    });
  });
  return provider;
}

function toSplineProvider(timeseries) {
  const provider = new SplineDataProvider();
  timeseries.forEach(ts => {
    const { technique, data } = ts;
    Object.entries(data).forEach(([key, value]) => {
      provider.setArray(`${key} - ${technique}`, value);
    });
  });
  return provider;
}

const reducer = handleActions({
  [FETCH_SAMPLES_REQUESTED]: (state, action) => {
    return {...state, samples: initialState.samples};
  },
  [FETCH_SAMPLES_SUCCEEDED]: (state, action) => {
    const { samples, platemapId, runId } = action.payload;
    return {...state, samples: samples.map(sample => patchSample(sample, platemapId, runId))};
  },
  [FETCH_TIMESERIE_SUCCEEDED]: (state, action) => {
    const { timeseries, fitted } = action.payload;
    if (timeseries.length === 0) {
      return state;
    }

    if ( fitted ) {
      return {...state, fittedTimeseries: {...state.fittedTimeseries, [timeseries[0].sampleId]: toSplineProvider(timeseries)}};
    } else {
      return {...state, timeseries: {...state.timeseries, [timeseries[0].sampleId]: toArrayProvider(timeseries)}};
    }
  },
}, initialState);

export default reducer;
