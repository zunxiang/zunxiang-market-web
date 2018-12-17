import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tag, Card, Icon, message, Spin, Button, Popconfirm } from 'antd';
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Prompt from '@/components/Prompt';
import styles from './Style.less';

const DragHandle = SortableHandle(() => (
  <Icon type="drag" title="拖动排序" className={styles.dragIcon} />
));

const SortableItem = SortableElement(({ value, afterClose }) => (
  <Tag closable className={styles.listTag} afterClose={afterClose}>
    <DragHandle />
    <span>{value}</span>
  </Tag>
));

const SortableList = SortableContainer(({ items, index, afterClose }) => (
  <div style={{ display: 'inline-block' }}>
    {items.map((child, childIndex) => (
      <SortableItem
        key={child.name}
        parentIndex={index}
        index={childIndex}
        value={child.name}
        afterClose={() => afterClose(index, childIndex)}
      />
    ))}
  </div>
));

@connect(({ loading }) => ({
  loading: loading.models.mallSetting,
}))
class TypeSetting extends PureComponent {
  state = {
    types: [],
    inputVisible: false,
    currentIndex: null,
    inputValue: '',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mallSetting/get',
      payload: {},
      callback: data => {
        this.setState({
          types: data.item_tags ? JSON.parse(data.item_tags) : [],
        });
      },
    });
  };

  handleShowInput = index => {
    this.setState({
      currentIndex: index,
      inputVisible: true,
    });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value.trim() });
  };

  handleInputConfirm = index => {
    const { inputValue } = this.state;
    if (inputValue) {
      const { types } = this.state;
      const newTypes = [...types];
      const row = newTypes[index];
      const findList = row.children.filter(val => val.name === inputValue);
      if (findList.length > 0) {
        message.error('该标签已经存在了');
        return;
      }
      const newRow = {
        ...row,
        children: [...row.children, { name: inputValue }],
      };
      newTypes.splice(index, 1, newRow);
      this.setState({
        types: newTypes,
        inputVisible: null,
      });
    } else {
      this.setState({
        inputVisible: -1,
      });
    }
  };

  handleClose = (parent, children) => {
    const { types } = this.state;
    const newTypes = [...types];
    const newChildren = [...newTypes[parent].children];
    newChildren.splice(children, 1);
    const row = {
      ...newTypes[parent],
      children: newChildren,
    };
    newTypes.splice(parent, 1, row);
    this.setState({ types: newTypes });
  };

  onSortEnd = props => {
    const { oldIndex, newIndex, parentIndex } = props;
    const { types } = this.state;
    const newTypes = [...types];
    const children = [...newTypes[parentIndex].children];
    const newChildren = arrayMove(children, oldIndex, newIndex);
    newTypes[parentIndex].children = newChildren;
    this.setState({
      types: newTypes,
    });
  };

  onParentSortEnd = props => {
    const { oldIndex, newIndex } = props;
    const { types } = this.state;
    const newTypes = arrayMove(types, oldIndex, newIndex);
    this.setState({
      types: newTypes,
    });
  };

  handlePromptSubmit = value => {
    const { types, currentIndex } = this.state;
    if (currentIndex !== null) {
      const newTypes = [...types];
      const children = [...newTypes[currentIndex].children, { ...value }];
      newTypes[currentIndex].children = children;
      this.setState({
        types: newTypes,
      });
    } else {
      this.setState({
        types: [...types, { ...value, children: [] }],
      });
    }
  };

  handlePromptCancel = () => {
    this.setState({
      currentIndex: null,
      inputVisible: false,
    });
  };

  handleRemove = index => {
    const { types } = this.state;
    const newTypes = types.filter((val, idx) => idx !== index);
    this.setState({
      types: newTypes,
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { types } = this.state;
    dispatch({
      type: 'mallSetting/set',
      payload: {
        item_tags: JSON.stringify(types),
      },
      callback: () => {
        message.success('保存成功');
      },
    });
  };

  render() {
    const { loading = false } = this.props;
    const { types, inputVisible } = this.state;
    const SortableParentItem = SortableElement(({ value, sort }) => (
      <Card
        title={
          <div>
            <DragHandle />
            {value.name}
          </div>
        }
        style={{ marginBottom: 16 }}
        extra={
          <Popconfirm
            title="确认删一级分类?"
            onConfirm={() => {
              this.handleRemove(sort);
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button type="danger" ghost size="small">
              删除
            </Button>
          </Popconfirm>
        }
      >
        <SortableList
          items={value.children || []}
          index={sort}
          afterClose={this.handleClose}
          onSortEnd={props => this.onSortEnd({ ...props, parentIndex: sort })}
          useDragHandle
          axis="xy"
        />
        <Tag
          onClick={() => this.handleShowInput(sort)}
          style={{ background: '#fff', borderStyle: 'dashed' }}
          className={styles.listTag}
        >
          <Icon type="plus" />
          添加
        </Tag>
      </Card>
    ));
    const SortableParentList = SortableContainer(({ items }) => (
      <div>
        {items.map((value, index) => (
          <SortableParentItem key={value.name} index={index} sort={index} value={value} />
        ))}
      </div>
    ));
    return (
      <PageHeaderWrapper>
        <Spin spinning={loading} delay={500}>
          <Card
            title="推荐标签设置"
            bodyStyle={{ padding: 0 }}
            extra={
              <Button
                type="primary"
                ghost
                block
                size="small"
                onClick={() => this.handleShowInput(null)}
              >
                添加
              </Button>
            }
          >
            <SortableParentList items={types} onSortEnd={this.onParentSortEnd} useDragHandle />
            <div style={{ margin: '32px 0', textAlign: 'center' }}>
              <Button type="primary" size="large" onClick={this.handleSubmit}>
                保存
              </Button>
            </div>
          </Card>
        </Spin>
        <Prompt
          title="添加标签"
          label="标签名"
          error="请输入标签名"
          name="name"
          onOk={this.handlePromptSubmit}
          onCancel={this.handlePromptCancel}
          modalVisible={inputVisible}
          type="input"
        />
      </PageHeaderWrapper>
    );
  }
}

export default TypeSetting;
