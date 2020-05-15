import { SearchResult, AugmentationInfo } from './types';

/**
 * Merges two augmentation infos into a single while merging their
 * left and right column names/indexes.
 */
function mergeJoinColumns(
  auginfo1: AugmentationInfo,
  auginfo2: AugmentationInfo
): AugmentationInfo {
  const leftColumns = [];
  const leftColumnsNames = [];
  const rightColumns = [];
  const rightColumnsNames = [];
  const length = auginfo1.left_columns[0].length;
  for (let i = 0; i < length; i++) {
    if (
      !auginfo1.left_columns[i] ||
      !auginfo1.left_columns_names[i] ||
      !auginfo1.right_columns[i] ||
      !auginfo1.right_columns_names[i]
    ) {
      // Defensive check: we verify the assumption that all arrays
      // have the same length and have valid values. If false, skip.
      continue;
    }
    leftColumns.push(auginfo1.left_columns[i]);
    leftColumnsNames.push(auginfo1.left_columns_names[i]);
    rightColumns.push(auginfo1.right_columns[i]);
    rightColumnsNames.push(auginfo1.right_columns_names[i]);
  }
  for (let i = 0; i < auginfo2.left_columns[0].length; i++) {
    if (
      !auginfo2.left_columns[i] ||
      !auginfo2.left_columns_names[i] ||
      !auginfo2.right_columns[i] ||
      !auginfo2.right_columns_names[i]
    ) {
      // Defensive check: we verify the assumption that all arrays
      // have the same length and have valid values. If false, skip.
      continue;
    }
    leftColumns.push(auginfo2.left_columns[i]);
    leftColumnsNames.push(auginfo2.left_columns_names[i]);
    rightColumns.push(auginfo2.right_columns[i]);
    rightColumnsNames.push(auginfo2.right_columns_names[i]);
  }
  return {
    ...auginfo1,
    left_columns: leftColumns,
    left_columns_names: leftColumnsNames,
    right_columns: rightColumns,
    right_columns_names: rightColumnsNames,
  };
}

export function aggregateResults(results: SearchResult[]): SearchResult[] {
  const aggregatedResults: {
    [key: string]: { firstRank: number; hit: SearchResult };
  } = {};

  results.forEach((hit, index) => {
    if (!hit.augmentation) {
      hit.augmentation = {
        type: 'none',
        left_columns: [],
        left_columns_names: [],
        right_columns: [],
        right_columns_names: [],
      };
    }

    const currentAugInfo = hit.augmentation;

    // we use this key to group hits that come from the same dataset and
    // have the same type
    const key = hit.id + currentAugInfo.type;
    console.log(key);
    if (!aggregatedResults[key]) {
      aggregatedResults[key] = {
        firstRank: index, // we keep the rank of the first appearance
        hit,
      };
    } else {
      // we already checked that this is never undefined
      const firstAugInfo = aggregatedResults[key].hit.augmentation!;

      // since we assume that unions appear only once in the search results,
      // so every time we find that a key already exists, the integration
      // type must be a 'join'.
      if (currentAugInfo.type !== 'join') {
        console.warn('Unexpected join type found while aggregating hits.');
      }
      console.log(
        `Merging results (${index}, ${hit.id}):\n1)`,
        firstAugInfo,
        '\n2)',
        currentAugInfo
      );

      aggregatedResults[key] = {
        firstRank: aggregatedResults[key].firstRank,
        hit: {
          ...aggregatedResults[key].hit,
          augmentation: mergeJoinColumns(firstAugInfo, currentAugInfo),
        },
      };
    }
  });

  return Object.values(aggregatedResults)
    .sort((a, b) => a.firstRank - b.firstRank)
    .map(r => r.hit);
}

export function getAugmentationColumns(aug?: AugmentationInfo) {
  console.log('getAugmentationColumns');

  if (!aug) {
    return [];
  }
  const columns: Array<{
    leftColumn: string;
    rightColumn: string;
    key: string;
    idx: number;
    scores: { joinability: number; correlation: number };
  }> = [];

  // Defensive check: to verify the assumption that all arrays
  // have the same length, we use the minimum of their length.
  const length = Math.min(
    aug.left_columns_names.length,
    aug.right_columns_names.length
  );

  for (let idx = 0; idx < length; idx++) {
    const leftColumn = aug.left_columns_names[idx].join(', ');
    const rightColumn = aug.right_columns_names[idx].join(', ');
    const key = `${leftColumn}, ${rightColumn}`;
    const scores =
      aug.scores && aug.scores[idx]
        ? aug.scores[idx]
        : { joinability: 0.0, correlation: 0.0 };
    columns.push({ leftColumn, rightColumn, key, idx, scores });
  }
  return columns;
}
