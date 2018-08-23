import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { EXPERIMENT_VIEW_ROUTE } from '../routes';
import { getExperiments, deleteExperiment } from '../redux/ducks/experiments';

import ExperimentList from '../components/experimentList';

class ExperimentListContainer extends Component {
  
  onAddExperiment = () => {
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/add`));
  }

  onOpenExperiment = (experiment) => {
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experiment._id}`));
  }

  onDeleteExperiment = (experiment) => {
    this.props.dispatch(deleteExperiment({experiment}));
  }

  render() {
    return (
      <ExperimentList
        experiments={this.props.experiments}
        onOpenExperiment={this.onOpenExperiment}
        onAddExperiment={this.onAddExperiment}
        onDeleteExperiment={this.onDeleteExperiment}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    experiments: getExperiments(state)
  }
}

export default connect(mapStateToProps)(ExperimentListContainer);
