import { has } from 'lodash-es';

import { ROOT_NODE } from '../root';

import {
  Layers,
  Folder,
  ChangeHistory
} from '@material-ui/icons';

import {
  lightBlue,
  deepOrange,
  indigo
} from '@material-ui/core/colors';

import IngestBatch from '../../containers/ingest/batch';

export const PROJECT_NODE = 'PROJECT_NODE';
export const BATCH_NODE = 'BATCH_NODE';
export const TEST0_NODE = 'TEST0_NODE';

export const NODES = {
  [ROOT_NODE] : {
    label: '',
    url: '',
    children: [PROJECT_NODE],
  },
  [PROJECT_NODE] : {
    label: 'Project',
    labelPlural: 'Projects',
    url: 'projects',
    children: [BATCH_NODE],
    parentId: null,
    primaryField: 'title',
    secondaryField: 'startDate',
    color: indigo[500],
    icon: Folder
  },
  [BATCH_NODE] : {
    label: 'Batch',
    labelPlural: 'Batches',
    url: 'batches',
    children: [TEST0_NODE],
    parentId: 'projectId',
    primaryField: 'title',
    secondaryField: 'startDate',
    fileFields: ['structFile', 'jsonStructZipFile'],
    color: deepOrange[500],
    icon: Layers,
    ingest: IngestBatch,
    sortFn: (a, b) => a.title < b.title ? -1 : 1
  },
  [TEST0_NODE] : {
    label: 'Test',
    labelPlural: 'Tests',
    url: 'tests',
    children: [],
    parentId: 'batchId',
    fileFields: ['scheduleFile', 'dataFile', 'metaDataFile'],
    primaryField: 'name',
    secondaryField: 'channel',
    secondaryPrefix: 'Channel',
    color: lightBlue[500],
    icon: ChangeHistory,
    visualizationField: 'summary'
  }
}

export function getNodeType(url, index) {
  const map = {
    0: {
      [NODES[PROJECT_NODE].url]: PROJECT_NODE
    },
    1: {
      [NODES[BATCH_NODE].url]: BATCH_NODE
    },
    2: {
      [NODES[TEST0_NODE].url]: TEST0_NODE
    },
  }

  if (has(map, `${index}.${url}`)) {
    return map[index][url];
  }

  console.warn('No matching node for this url');
  return null;
}
