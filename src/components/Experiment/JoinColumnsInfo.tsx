import React from 'react';
import { SearchResult } from '../../api/types';
import { SimpleColumnBadge, ColumnBadge } from '../Badges/Badges';
import { DonutGlyph } from '../Experiment/DonutGlyph';
import { getAugmentationColumns } from '../../api/augmentation';
import './JoinColumnsInfo.css';

function scoreLabel(score: number) {
  let label;
  if (score > 0.75) {
    label = 'Great';
  } else if (score > 0.5) {
    label = 'Good ';
  } else if (score > 0.25) {
    label = 'Fair ';
  } else {
    label = 'Poor ';
  }
  return label;
}

function CorrelationScore(props: { score: number }) {
  return (
    <span className="small">
      <DonutGlyph className="mr-1" percent={props.score} />
      {scoreLabel(props.score)}
    </span>
  );
}

function JoinabilityScore(props: { score: number }) {
  return (
    <span className="small">
      <DonutGlyph className="mr-1" percent={props.score} />
      {scoreLabel(props.score)}
    </span>
  );
}

interface JoinColumnsInfoProps {
  hit: SearchResult;
  selectColumn?: {
    onSelectColumnIndex: (index: number) => void;
    selectedIndex: number;
  };
}

function JoinColumnsInfo(props: JoinColumnsInfoProps) {
  if (!props.hit.augmentation || props.hit.augmentation.type !== 'join') {
    return null;
  }

  const hit = props.hit;
  console.log('hit:', hit);
  const columns = getAugmentationColumns(props.hit.augmentation);
  const type = props.hit.augmentation.type;
  return (
    <>
      <b className="mt-2 mb-1">
        {props.selectColumn ? (
          <>Select a column to JOIN on:</>
        ) : (
          <>
            Detected augmentations (
            <span style={{ textTransform: 'uppercase' }}>{type}</span>):
          </>
        )}
      </b>
      <table className="join-table">
        <thead>
          <tr>
            {props.selectColumn && <th></th>}
            <th>Join column 1 (query)</th>
            <th></th>
            <th>Join column 2 (this table)</th>
            <th>Join intersection</th>
            <th>Correlations score</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((c, i) => {
            const rightMetadata = hit.metadata.columns.find(
              m => m.name === c.rightColumn
            );
            return (
              <tr key={`div-aug-${i}`}>
                {/* <th scope="row">{i+1}</th> */}
                {props.selectColumn && (
                  <td style={{ fontSize: '0.75rem' }}>
                    <input
                      type="radio"
                      value={i}
                      checked={i === props.selectColumn.selectedIndex}
                      onChange={() => {
                        props.selectColumn &&
                          props.selectColumn.onSelectColumnIndex(i);
                      }}
                    />
                  </td>
                )}
                <td>
                  <SimpleColumnBadge name={c.leftColumn} />
                </td>
                <td>=</td>
                <td>
                  {rightMetadata ? (
                    <ColumnBadge column={rightMetadata} />
                  ) : (
                    <SimpleColumnBadge name={c.rightColumn} />
                  )}
                </td>
                <td>
                  <JoinabilityScore score={c.scores.joinability} />
                </td>
                <td>
                  <CorrelationScore score={c.scores.correlation} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export { JoinColumnsInfo };
