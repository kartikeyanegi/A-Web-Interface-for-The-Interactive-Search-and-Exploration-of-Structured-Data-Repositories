import * as React from 'react';
import * as Icon from 'react-feather';
import { formatSize } from '../../utils';
import { SearchResult, RelatedFile } from '../../api/types';
import { Description, DataTypes, DatasetColumns } from './Metadata';
import { SearchQuery } from '../../api/rest';
import { JoinColumnsInfo } from '../Experiment/JoinColumnsInfo';

interface SearchHitProps {
  searchQuery: SearchQuery;
  hit: SearchResult;
  onSearchHitExpand: (hit: SearchResult) => void;
  onSearchRelated?: (relatedFile: RelatedFile) => void;
  onAugmentationExpand?: (hit: SearchResult) => void;
}

interface SearchHitState {
  hidden: boolean;
}

function HitTitle(props: { hit: SearchResult }) {
  return (
    <span
      className="text-primary"
      style={{ fontSize: '1.2rem', fontFamily: 'Source Sans Pro' }}
    >
      {props.hit.metadata.name}{' '}
      <span className="small text-muted text-nowrap">
        ({formatSize(props.hit.metadata.size)})
      </span>
    </span>
  );
}

class SearchHit extends React.PureComponent<SearchHitProps, SearchHitState> {
  constructor(props: SearchHitProps) {
    super(props);
    this.state = {
      hidden: true,
    };
    this.handleSearchHitExpand = this.handleSearchHitExpand.bind(this);
    this.handleSearchRelated = this.handleSearchRelated.bind(this);
  }

  handleSearchHitExpand() {
    this.props.onSearchHitExpand(this.props.hit);
  }

  handleSearchRelated() {
    if (!this.props.onSearchRelated) {
      return;
    }
    const relatedFile: RelatedFile = {
      kind: 'searchResult',
      datasetId: this.props.hit.id,
      datasetName: this.props.hit.metadata.name,
      datasetSize: this.props.hit.metadata.size,
    };
    this.props.onSearchRelated(relatedFile);
  }

  renderButtons(hit: SearchResult) {
    const { onAugmentationExpand, onSearchRelated } = this.props;
    return (
      <div className="mt-2">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={this.handleSearchHitExpand}
        >
          <Icon.Info className="feather" /> Dataset Details
        </button>
        {onAugmentationExpand && (
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => onAugmentationExpand(hit)}
          >
            <Icon.PlusSquare className="feather" /> Augment Dataset
          </button>
        )}
        {onSearchRelated && (
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={this.handleSearchRelated}
          >
            <Icon.Search className="feather" /> Search Related
          </button>
        )}
      </div>
    );
  }

  render() {
    const { hit } = this.props;
    return (
      <div className="card mb-4 shadow-sm d-flex flex-row">
        <div className="card-body d-flex flex-column">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-column">
              <HitTitle hit={hit} />
              <span className="small">Source: {hit.metadata.source}</span>
            </div>
            <DataTypes hit={hit} label={false} className="text-nowrap mt-1" />
          </div>
          <Description hit={hit} label={false} />
          <DatasetColumns
            columns={hit.metadata.columns}
            label={true}
            maxLength={90}
          />
          <JoinColumnsInfo hit={hit} />
          {this.renderButtons(hit)}
          {/* <AugmentationOptions hit={hit} searchQuery={searchQuery} /> */}
        </div>
        <div
          className="d-flex align-items-stretch"
          style={{ cursor: 'pointer' }}
          onClick={this.handleSearchHitExpand}
        >
          <div style={{ margin: 'auto 2px' }}>
            <Icon.ChevronRight className="feather feather-lg" />
          </div>
        </div>
      </div>
    );
  }
}

export { SearchHit };
