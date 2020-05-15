import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import {
  SearchResult,
  ColumnAggregations,
  AugmentationColumn,
} from '../../../api/types';
import { ColumnSourceBin } from './ColumnSourceBin';
import { ColumnTargetBin } from './ColumnTargetBin';
import { JoinColumnsInfo } from '../JoinColumnsInfo';

interface Props {
  hit: SearchResult;
  excludeColumns?: string[];
  onChange: (columnAggregations: ColumnAggregations) => void;
}

interface State {
  columns: AugmentationColumn[];
  selectedColumnIndex: number;
}

class JoinColumnsSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { columns: [], selectedColumnIndex: 0 };
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSelectJoinColumn = this.handleSelectJoinColumn.bind(this);
  }

  unique(columns: AugmentationColumn[]): AugmentationColumn[] {
    const uniqueColumns: {
      [key: string]: AugmentationColumn;
    } = {};
    columns.forEach(c => {
      uniqueColumns[c.name] = c;
    });
    // columns.reduce((unique: {[name: string]: AugmentationColumn}, c) => {
    //   unique[c.name] = c;
    //   return unique;
    // }, {});
    return Object.values(columns);
  }

  handleDrop(column: AugmentationColumn) {
    const columns = this.unique([...this.state.columns, column]);

    const columnAggregations: ColumnAggregations = {};
    columns.forEach(c => {
      columnAggregations[c.orig_name] = columnAggregations[c.orig_name] || [];
      columnAggregations[c.orig_name].push(c.agg_function);
    });

    this.setState(
      {
        columns: columns,
      },
      () => {
        this.props.onChange(columnAggregations);
      }
    );
  }

  handleSelectJoinColumn(index: number) {
    if (this.state.selectedColumnIndex !== index) {
      this.setState({ selectedColumnIndex: index, columns: [] });
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    let joinIndex = state.selectedColumnIndex;
    if (
      props.hit.augmentation &&
      props.hit.augmentation.new_columns &&
      props.hit.augmentation.new_columns.length <= joinIndex
    ) {
      return { selectedColumnIndex: 0 };
    }
    return null;
  }

  render() {
    const { hit, excludeColumns } = this.props;
    if (
      !hit.augmentation ||
      hit.augmentation.type === 'none' ||
      !hit.augmentation.new_columns
    ) {
      return null;
    }

    let joinIndex = this.state.selectedColumnIndex;
    let augmentationColumns = hit.augmentation.new_columns[joinIndex];
    if (excludeColumns) {
      augmentationColumns.filter(
        d => excludeColumns && !excludeColumns.find(e => e === d.orig_name)
      );
    }
    augmentationColumns = augmentationColumns
      .map(d => {
        const metadata = hit.metadata.columns.find(c => c.name === d.orig_name);
        if (!metadata) {
          console.error("Couldn't find metadata for column: " + d.orig_name);
          return null;
        }
        let types;
        if (d.agg_function === 'first' || d.agg_function === 'value') {
          if (metadata.structural_type.endsWith('Text')) {
            types = { categorical: true };
          } else {
            types = { numerical: true };
          }
        } else {
          types = { numerical: true };
        }

        return { ...d, types };
      })
      .filter(d => d) as AugmentationColumn[];

    augmentationColumns.sort((a, b) => b.score - a.score);

    return (
      <DndProvider backend={Backend}>
        <div className="row">
          <div className="col">
            <JoinColumnsInfo
              hit={hit}
              selectColumn={{
                selectedIndex: joinIndex,
                onSelectColumnIndex: this.handleSelectJoinColumn,
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col d-flex flex-column">
            <ColumnSourceBin
              uniqueBinId={hit.id}
              columns={augmentationColumns}
              onDrop={this.handleDrop}
            />
          </div>
          <div className="col">
            <ColumnTargetBin
              columns={this.state.columns}
              uniqueBinId={hit.id}
            />
          </div>
        </div>
      </DndProvider>
    );
  }
}

export { JoinColumnsSelector };
