import React from 'react';
import { AugmentationColumn, ColumnMetadata } from '../../../api/types';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { ColumnBar } from '../../Badges/Badges';

export const ItemType = 'column';

interface DraggableBarProps {
  column: AugmentationColumn;
  onDrop: (column: AugmentationColumn) => void;
}

const DraggableBar: React.FC<DraggableBarProps> = ({ column, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { column, type: ItemType },
    end: (item: ColumnMetadata | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // onDrop(column, dropResult.name);
        onDrop(column);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} style={{ cursor: 'move', opacity }}>
      <ColumnBar column={column} />
    </div>
  );
};

const columnsBoxStyle: React.CSSProperties = {
  border: '1px solid #c0c0c0',
  padding: '.25rem',
  width: '100%',
  height: '250px',
  overflowY: 'scroll',
  overflowX: 'hidden',
  marginRight: '.5rem!important',
};

interface Props {
  uniqueBinId: string;
  columns: AugmentationColumn[];
  onDrop: (column: AugmentationColumn) => void;
}

const ColumnSourceBin: React.FC<Props> = ({ uniqueBinId, columns, onDrop }) => {
  return (
    <>
      <b className="mt-2">Available columns:</b>
      <span className="small">
        Select which columns should be added to the final merged dataset.
      </span>
      <div style={columnsBoxStyle}>
        {columns.map((c, i) => {
          return (
            <DraggableBar
              key={`dragbar-${i}-${uniqueBinId}`}
              column={c}
              onDrop={c => onDrop(c)}
            />
          );
        })}
      </div>
    </>
  );
};

export { ColumnSourceBin };
