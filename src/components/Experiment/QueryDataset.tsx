import React from 'react';
import { SearchResult } from '../../api/types';
import { formatSize } from '../../utils';
import {
  Description,
  DataTypes,
  DatasetColumns,
  SpatialCoverage,
} from '../SearchResults/Metadata';
import { DatasetSample } from '../SearchResults/DatasetSample';
import { ColumnBadge } from '../Badges/Badges';

function QueryDatasetInfoBox(props: {
  hit: SearchResult;
  targetIndex: number;
}) {
  const { hit, targetIndex } = props;
  return (
    <div>
      <div>
        <div className="card shadow-sm">
          <div className="card-body d-flex flex-column">
            <h4>{hit.metadata.name}</h4>
            <Description hit={hit} label={true} />
            <DataTypes hit={hit} label={true} />
            <DatasetColumns
              columns={hit.metadata.columns}
              maxLength={350}
              label={true}
            />
            <div className="mt-2">
              <b>Target:</b>{' '}
              <ColumnBadge column={hit.metadata.columns[targetIndex]} />{' '}
              <i>(this column is what you want to predict!)</i>
            </div>
            <div className="mt-2">
              <b>Size:</b> {formatSize(hit.metadata.size)}
            </div>
            <div className="mt-2">
              <SpatialCoverage hit={hit} />
            </div>
            <div className="mt-2">
              <DatasetSample hit={hit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { QueryDatasetInfoBox };
