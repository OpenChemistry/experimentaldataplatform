import React from 'react';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

export function renderDisplayFields(fields, exclude = null) {
  if (!exclude) {
    exclude = [];
  }
  let displayFields = [];
  for (let key in fields) {
    const field = fields[key];
    const type = field.type;
    const label = field.label;
    // const disabled = field.hasOwnProperty('disabled') ? field.disabled : false;
    const value = field.value;
    const hidden = field.hasOwnProperty('hidden') ? field.hidden : false;

    let doPush = (
      exclude.findIndex((val) => val === key) === -1 &&
      value
    );

    if (!doPush) {
      continue;
    }

    switch (type) {
      case 'checkbox': {
        displayFields.push(
          <div key={key} hidden={hidden}>
            <Typography gutterBottom variant="subheading" color="textSecondary">
              {label}
              <Checkbox
                disabled
                checked={value}
              />
            </Typography>
          </div>
        )
        break;
      }

      case 'textarea':
      case 'text': {
        displayFields.push(
          <div key={key} hidden={hidden}>
            <Typography gutterBottom variant="subheading" color="textSecondary">
              {label}
            </Typography>
            <Typography  paragraph>
              {value}
            </Typography>
          </div>
        );
        break;
      }

      case 'fileId': {
        const downloadUrl = `/api/v1/file/${value}/download`;
        displayFields.push(
          <div key={key} hidden={hidden}>
            <Typography gutterBottom variant="subheading" color="textSecondary">
              {label}
            </Typography>
            <Typography  paragraph>
              <a href={downloadUrl}>Download</a>
            </Typography>
          </div>
        );
        break;
      }

      default: {
        break;
      }
    }
  }
  return displayFields;
}