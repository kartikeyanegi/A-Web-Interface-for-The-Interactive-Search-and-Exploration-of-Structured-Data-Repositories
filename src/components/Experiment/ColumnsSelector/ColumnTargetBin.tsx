import React from 'react';
import { useDrop } from 'react-dnd';
import { ColumnBadge, BadgeGroup } from '../../Badges/Badges';
import { AugmentationColumn } from '../../../api/types';

export const ItemType = 'column';

const badgeBinStyle = (background: string): React.CSSProperties => ({
  border: '1px solid #c0c0c0',
  padding: '.25rem',
  height: '250px',
  backgroundColor: background,
});

interface BadgeBinProps {
  uniqueBinId: string;
  columns?: AugmentationColumn[];
}

const ColumnTargetBin: React.FC<BadgeBinProps> = ({ uniqueBinId, columns }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemType,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      // column: monitor.getItem()?.column as AugmentationColumn | null,
    }),
  });

  let background = 'transparent';
  const isActive = canDrop && isOver;
  if (isActive) {
    // green-ish, when badge is over the target bin
    background = '#859f2850';
  } else if (canDrop) {
    // gray-ish, while badge in being dragged toward the target bin
    background = '#f0f0f0';
  }
  return (
    <div className="d-flex flex-column">
      <b className="mt-2">Included after merge:</b>
      <span className="small">
        You final dataset with have the following columns in addition to the
        original columns.
      </span>
      <div ref={drop} style={badgeBinStyle(background)}>
        {isActive ? (
          <span className="small">Release to drop!</span>
        ) : columns && columns.length > 0 ? (
          <BadgeGroup>
            {columns.map((c, i) => (
              <ColumnBadge
                key={`badge-bin-${uniqueBinId}-column-${i}`}
                column={c}
                function={c.agg_function}
              />
            ))}
          </BadgeGroup>
        ) : (
          <span className="small">
            Drag columns here to include them in the final merged dataset.
          </span>
        )}
      </div>
    </div>
  );
};

export { ColumnTargetBin };
