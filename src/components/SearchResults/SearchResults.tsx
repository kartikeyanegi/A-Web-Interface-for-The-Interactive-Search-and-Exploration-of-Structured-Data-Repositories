import React from 'react';
import * as Icon from 'react-feather';
import { SearchResponse, SearchResult, RelatedFile } from '../../api/types';
import { SearchHit } from './SearchHit';
import { SearchState } from './SearchState';
import { Loading } from '../visus/Loading/Loading';
import { HitInfoBox } from './HitInfoBox';
import { SearchQuery } from '../../api/rest';
import { AugmentationInfoBox } from '../Experiment/AugmentationInfoBox';

interface SearchResultsProps {
  searchQuery: SearchQuery;
  searchState: SearchState;
  searchResponse?: SearchResponse;
  onSearchRelated?: (relatedFile: RelatedFile) => void;
}

interface SearchResultsState {
  selectedHit?: SearchResult;
  infoboxType?: 'dataset' | 'augmentation';
}

class SearchResults extends React.PureComponent<
  SearchResultsProps,
  SearchResultsState
> {
  lastSearchResponse?: SearchResponse;

  constructor(props: SearchResultsProps) {
    super(props);
    this.state = {};
    this.handleSearchHitExpand = this.handleSearchHitExpand.bind(this);
    this.handleAugmentationExpand = this.handleAugmentationExpand.bind(this);
  }

  componentDidUpdate() {
    if (
      this.lastSearchResponse &&
      this.lastSearchResponse !== this.props.searchResponse
    ) {
      this.setState({ selectedHit: undefined });
    }
    this.lastSearchResponse = this.props.searchResponse;
  }

  handleSearchHitExpand(hit: SearchResult) {
    this.setState({ selectedHit: hit, infoboxType: 'dataset' });
  }

  handleAugmentationExpand(hit: SearchResult) {
    this.setState({ selectedHit: hit, infoboxType: 'augmentation' });
  }

  render() {
    const { searchResponse, searchState, searchQuery } = this.props;
    const centeredDiv: React.CSSProperties = {
      width: 750,
      textAlign: 'center',
      marginTop: '1rem',
    };
    switch (searchState) {
      case SearchState.SEARCH_REQUESTING: {
        return (
          <div style={centeredDiv}>
            <Loading message="Searching..." />
          </div>
        );
      }
      case SearchState.SEARCH_FAILED: {
        return (
          <div style={centeredDiv}>
            <Icon.XCircle className="feather" />
            &nbsp; An unexpected error occurred. Please try again later.
          </div>
        );
      }
      case SearchState.SEARCH_SUCCESS: {
        if (!(searchResponse && searchResponse.results.length > 0)) {
          return (
            <div style={centeredDiv}>
              <Icon.AlertCircle className="feather text-primary" />
              &nbsp;No datasets found, please try another query.
            </div>
          );
        }

        // TODO: Implement proper results pagination
        const page = 1;
        const k = 20;
        const currentHits = searchResponse.results.slice(
          (page - 1) * k,
          page * k
        );
        const { selectedHit, infoboxType } = this.state;
        return (
          <div className="d-flex flex-row">
            <div style={{ width: 750 }}>
              {currentHits.map((hit, idx) => (
                <SearchHit
                  searchQuery={searchQuery}
                  hit={hit}
                  key={idx}
                  onSearchHitExpand={this.handleSearchHitExpand}
                  onAugmentationExpand={this.handleAugmentationExpand}
                  onSearchRelated={this.props.onSearchRelated}
                />
              ))}
            </div>
            {selectedHit && infoboxType === 'dataset' && (
              <HitInfoBox hit={selectedHit} />
            )}
            {selectedHit && infoboxType === 'augmentation' && (
              <AugmentationInfoBox hit={selectedHit} />
            )}
          </div>
        );
      }
      case SearchState.CLEAN:
      default: {
        return null;
      }
    }
  }
}

export { SearchResults };
