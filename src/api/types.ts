export interface AugmentationTask {
  data: SearchResult;
}

export interface ColumnAggregations {
  [columnName: string]: string[];
}

export interface DataTypes {
  numerical?: boolean;
  textual?: boolean;
  spatial?: boolean;
  temporal?: boolean;
}

export interface AugmentationColumn {
  orig_name: string;
  name: string;
  score: number;
  agg_function: string;
  types: DataTypes;
}

export interface AugmentationInfo {
  type: string;
  left_columns: number[][];
  left_columns_names: string[][];
  right_columns: number[][];
  right_columns_names: string[][];
  agg_functions?: ColumnAggregations;
  new_columns?: AugmentationColumn[][];
  scores?: Array<{ joinability: number; correlation: number }>;
}

export interface SpatialCoverage {
  lat?: string;
  lon?: string;
  address?: string;
  ranges: Array<{
    range: {
      coordinates: [[number, number], [number, number]];
      type: 'envelope';
    };
  }>;
}

export interface Metadata {
  id: string;
  filename?: string;
  name: string;
  description: string;
  size: number;
  nb_rows: number;
  columns: ColumnMetadata[];
  date: string;
  materialize: {};
  nb_profiled_rows: number;
  sample: string;
  source: string;
  version: string;
  spatial_coverage?: SpatialCoverage[];
}

export interface ColumnMetadata {
  name: string;
  structural_type: string;
  semantic_types: string[];
  num_distinct_values?: number;
  coverage?: Array<{}>;
  mean?: number;
  stddev?: number;
  plot?: {};
}

export interface SearchResult {
  id: string;
  score: number;
  // join_columns: Array<[string, string]>;
  metadata: Metadata;
  augmentation?: AugmentationInfo;
  supplied_id: string | null;
  supplied_resource_id: string | null;
  d3m_dataset_description: {};
  sample: string[][];
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface Variable {
  type: string;
}

export interface TemporalVariable {
  type: 'temporal_variable';
  start?: string;
  end?: string;
}

export interface GeoSpatialVariable {
  type: 'geospatial_variable';
  latitude1: string;
  longitude1: string;
  latitude2: string;
  longitude2: string;
}

export type FilterVariables = TemporalVariable | GeoSpatialVariable;

export interface QuerySpec {
  keywords: string[];
  source?: string[];
  variables: FilterVariables[];
}

export interface RelatedToLocalFile {
  kind: 'localFile';
  file: File;
}

export interface RelatedToSearchResult {
  kind: 'searchResult';
  datasetId: string;
  datasetName: string;
  datasetSize: number;
}

export type RelatedFile = RelatedToLocalFile | RelatedToSearchResult;
