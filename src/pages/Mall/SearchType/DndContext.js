import React from 'react';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const dragDirection = (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
  return false;
};

const Body = props => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };

  let { className } = restProps;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(
      <div {...restProps} className={className} style={style}>
        {props.children}
      </div>
    )
  );
};

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

/*
  eslint no-param-reassign: [
    "error",
    {
      "props": true,
      "ignorePropertyModificationsFor": ["monitor"],
    }
  ]
*/
const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const getBody = dragType =>
  DropTarget(dragType, rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
  }))(
    DragSource(dragType, rowSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      dragRow: monitor.getItem(),
      clientOffset: monitor.getClientOffset(),
      initialClientOffset: monitor.getInitialClientOffset(),
    }))(Body)
  );

class DragSortingTable extends React.Component {
  state = {};

  render() {
    const { dataSource, moveRow, render: r, dragType, ...otherProps } = this.props;
    const RenderBody = getBody(dragType);
    return dataSource.map((val, index) => (
      <RenderBody moveRow={moveRow} index={index} {...otherProps} key={val.name}>
        {r(val, index)}
      </RenderBody>
    ));
  }
}

export default DragDropContext(HTML5Backend)(DragSortingTable);
