import React from 'react';
import * as Icon from 'react-feather';
import {
  SearchResult,
  // AugmentationInfo,
  // ColumnAggregations,
} from '../../api/types';
// import * as api from '../../api/rest';
import { JoinColumnsSelector } from './ColumnsSelector/JoinColumnsSelector';
import { render } from 'ol/control/ZoomSlider';
// import { cloneObject, triggerFileDownload } from '../../utils';

// function createAugmentationInfo(
//   original: AugmentationInfo,
//   checkedIndexes: number[],
//   columnAggregations?: ColumnAggregations
// ) {
//   // make a copy of the original so we can modify it
//   const augmentation = cloneObject(original);

//   augmentation.left_columns = [];
//   augmentation.left_columns_names = [];
//   augmentation.right_columns = [];
//   augmentation.right_columns_names = [];

//   // copy only the selected indexes from the original
//   // augmentation info to our augmentation request
//   augmentation.type = original.type;
//   for (const i of checkedIndexes) {
//     augmentation.left_columns.push(original.left_columns[i]);
//     augmentation.left_columns_names.push(original.left_columns_names[i]);
//     augmentation.right_columns.push(original.right_columns[i]);
//     augmentation.right_columns_names.push(original.right_columns_names[i]);
//   }

//   augmentation.agg_functions = columnAggregations;

//   return augmentation;
// }

async function submitAugmentationForm(hit: SearchResult) {
  // // find indexes of columns that are checked
  // const checkedIndexes = findIndexesOfCheckedColumn();
  // this.state.columnAggregations

  // // augmentation form is only shown when a file was provided as search
  // // input, so the file should never be undefined at this point. The search
  // // API always returns hit.augmentation when the file was provided.
  // const original = hit.augmentation!;
  // const relatedFile = this.props.searchQuery.relatedFile!;

  // // clone object because we need to modify it for sending as an API parameter
  // const task = cloneObject(hit);

  // // adjust augmentation info to use only the checked indexes
  // task.augmentation = createAugmentationInfo(
  //   original,
  //   checkedIndexes,
  //   columnAggregations
  // );

  // console.log('submit', task);

  // api.augment(relatedFile, task).then(response => {
  //   const zipFile = response.data;
  //   if (zipFile) {
  //     triggerFileDownload(zipFile, 'augmentation.zip');
  //   } else {
  //     console.error('Augment API call returned invalid file: ', zipFile);
  //   }
  // });
}

interface Props {
  hit: SearchResult;
}

class AugmentationInfoBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  renderAugmentButton(hit: SearchResult, type: string) {
    const btnActive = true; // findIndexesOfCheckedColumn().length > 0;
    const btnClass = `btn btn-sm btn-outline-primary mt-2${
      btnActive ? '' : ' disabled'
    }`;
    const btnOnClick = btnActive
      ? () => submitAugmentationForm(hit)
      : undefined;
    // const btnOnClick = undefined;
    return (
      <button className={btnClass} onClick={btnOnClick}>
        <Icon.Download className="feather" /> Merge{' '}
        <span style={{ textTransform: 'uppercase' }}>({type}) </span>
        &amp; Download
      </button>
    );
  }

  render() {
    const { hit } = this.props;
    if (!hit.augmentation || hit.augmentation.type === 'none') {
      return null;
    }
    const { type } = hit.augmentation;

    return (
      <div className="ml-2" style={{ maxWidth: 800 }}>
        <div className="sticky-top" style={{ top: '1rem' }}>
          <div
            className="card shadow-sm ml-2"
            style={{
              maxHeight: '96vh',
              overflowY: 'scroll',
            }}
          >
            <div className="card-body d-flex flex-column">
              <h4>Augmentation: {hit.metadata.name}</h4>
              <JoinColumnsSelector hit={hit} onChange={() => {}} />
              <div>{this.renderAugmentButton(hit, type)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export { AugmentationInfoBox };
