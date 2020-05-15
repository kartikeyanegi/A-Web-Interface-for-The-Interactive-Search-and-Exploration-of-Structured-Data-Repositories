import React from 'react';
import * as Icon from 'react-feather';
import * as d3 from 'd3';
import './Badges.css';
import { IconAbc } from './IconAbc';
import { ColumnMetadata, AugmentationColumn, DataTypes } from '../../api/types';

function columnType(column: ColumnMetadata): DataTypes {
  switch (column.structural_type) {
    case 'http://schema.org/Integer':
    case 'http://schema.org/Float':
      if (
        column.semantic_types.includes('http://schema.org/latitude') ||
        column.semantic_types.includes('http://schema.org/longitude')
      ) {
        return { numerical: true, spatial: true };
      }
      return { numerical: true };
    case 'http://schema.org/Text':
    default:
      if (column.semantic_types) {
        if (column.semantic_types.includes('http://schema.org/DateTime')) {
          return { textual: true, temporal: true };
        }
        if (
          column.semantic_types.includes('http://schema.org/latitude') ||
          column.semantic_types.includes('http://schema.org/longitude')
        ) {
          return { textual: true, spatial: true };
        }
      }
      return { textual: true };
  }
}

function iconForType(types: DataTypes) {
  if (types.spatial) {
    return Icon.Globe;
  } else if (types.temporal) {
    return Icon.Calendar;
  } else if (types.numerical) {
    return Icon.Hash;
  } else {
    return IconAbc;
  }
}

export function SpatialBadge() {
  return (
    <span className="badge badge-primary badge-pill badge-spatial">
      <Icon.MapPin className="feather-xs mr-1" />
      Spatial
    </span>
  );
}

export function TemporalBadge() {
  return (
    <span className="badge badge-info badge-pill badge-temporal">
      <Icon.Calendar className="feather-xs mr-1" />
      <span>Temporal</span>
    </span>
  );
}

export function SimpleColumnBadge(props: { name: string }) {
  return <span className={`badge badge-pill badge-column`}>{props.name}</span>;
}

function isAugmentationColumn(column: Object): column is AugmentationColumn {
  return (column as AugmentationColumn).types !== undefined;
}

export function ColumnBadge(props: {
  column: ColumnMetadata | AugmentationColumn;
  function?: string;
}) {
  const column = props.column;

  let label;
  let types;
  if (isAugmentationColumn(column)) {
    types = column.types;
    label = column.name;
    if (!column.name) {
      label = `${column.agg_function.toUpperCase()}(${column.orig_name})`;
    }
  } else {
    types = columnType(column);
    label = props.column.name;
    if (props.function) {
      label = `${props.function.toUpperCase()}(${label})`;
    }
  }

  const badgeClass = types.numerical ? 'badge-numerical' : 'badge-textual';
  const BadgeIcon = iconForType(types);

  return (
    <span className={`badge badge-pill ${badgeClass}`}>
      <BadgeIcon className="feather-xs-w" />
      {label}
    </span>
  );
}

interface BadgeGroupProps {
  className?: string;
}

export const BadgeGroup: React.FunctionComponent<BadgeGroupProps> = props => (
  <div
    className={`badge-group${props.className ? ` ${props.className} ` : ''}`}
  >
    {props.children}
  </div>
);

export function ColumnBar(props: {
  column: AugmentationColumn;
  function?: string;
}) {
  let label = props.column.name;
  if (props.function) {
    label = `${props.function.toUpperCase()}(${label})`;
  }
  const types = props.column.types;
  const width = `${props.column.score * 100 * 0.95}%`;
  const badgeColor = types.numerical ? '#1ab082' : '#4d96b2';
  const BadgeIcon = iconForType(types);
  const barLeft = 20;

  const colorDelta = 0.3;
  const colorScale = d3
    .scaleSequential(d3.interpolatePuBu)
    .domain([0, 1 + colorDelta + 0.2]);
  const barColor = colorScale(props.column.score + colorDelta);
  return (
    <div
      className={badgeColor}
      style={{ position: 'relative', width: `100%`, height: '20px' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: barLeft,
          background: barColor,
          opacity: 0.6,
          width: width,
          height: '16px',
        }}
      />
      <BadgeIcon
        className="feather-xs-w"
        style={{
          position: 'absolute',
          top: 3,
          left: 0,
          fontSize: '.75rem',
          color: badgeColor,
        }}
      />
      <span
        title={`${+props.column.score.toFixed(2)}`}
        style={{
          position: 'absolute',
          top: 1,
          left: barLeft + 5,
          fontSize: '.75rem',
        }}
      >
        {label}
      </span>
    </div>
  );
}
