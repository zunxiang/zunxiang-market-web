import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tag,
  Card,
  Icon,
  message,
  Spin,
  Button,
  Popconfirm,
  Avatar,
  Form,
  Input,
  Modal,
} from 'antd';
import update from 'immutability-helper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Upload from '@/components/FormItems/Upload';
import Prompt from '@/components/Prompt';
import DndContext from './SearchType/DndContext';
import SketchPicker from './SearchType/SketchPicker';
import { BaseImgUrl } from '@/common/config';
import styles from './Style.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
    md: { span: 17 },
  },
};
const IconTagFrom = Form.create()(props => {
  const { form, visible, onCancel, onSubmit } = props;
  const { getFieldDecorator } = form;
  const onOk = () => {
    form.validateFieldsAndScroll((err, fieldsvalue) => {
      if (err) return;
      const values = {
        ...fieldsvalue,
        icon: fieldsvalue.icon && fieldsvalue.icon[0].response.hash,
        key: Math.random()
          .toString(36)
          .substring(2, 10),
      };
      onSubmit(values);
    });
  };

  return (
    <Modal title="添加分类标签" visible={visible} onCancel={onCancel} onOk={onOk} destroyOnClose>
      <Form>
        <Upload
          formItemProps={{
            ...formItemLayout,
            label: '图标',
          }}
          filedName="icon"
          getFieldDecorator={getFieldDecorator}
          max={1}
          fieldOptions={{
            rules: [
              {
                required: false,
                type: 'array',
                min: 1,
                message: '请上传图标',
              },
            ],
          }}
        />
        <FormItem {...formItemLayout} label="背景色">
          {getFieldDecorator('color', {
            rules: [
              {
                required: true,
                message: '请选择背景色',
              },
            ],
            valuePropName: 'color',
            initialValue: '#d9d9d9',
          })(<SketchPicker />)}
        </FormItem>
        <FormItem {...formItemLayout} label="分类名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入分类名称',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});
@connect(({ loading }) => ({
  loading: loading.models.mallSetting,
}))
class TypeSetting extends PureComponent {
  state = {
    types: [],
    inputVisible: false,
    currentIndex: null,
    inputValue: '',
    modalVisible: false,
    navs: [],
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mallSetting/get',
      payload: {},
      callback: data => {
        this.setState({
          types: data.item_tags ? JSON.parse(data.item_tags) : [],
          navs: data.navigation ? JSON.parse(data.navigation) : [],
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
    const { types, navs } = this.state;
    dispatch({
      type: 'mallSetting/set',
      payload: {
        item_tags: JSON.stringify(types),
        navigation: JSON.stringify(navs),
      },
      callback: () => {
        message.success('保存成功');
      },
    });
  };

  handleMoveParent = (dragIndex, hoverIndex) => {
    const { types } = this.state;
    const dragRow = types[dragIndex];
    const newList = update(types, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    this.setState({
      types: [...newList],
    });
  };

  handleMoveChildren = (parentIndex, dragIndex, hoverIndex) => {
    const { types } = this.state;
    const newTypes = [...types];
    const { children } = newTypes[parentIndex];
    const dragRow = children[dragIndex];
    const newChildren = update(children, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    newTypes[parentIndex].children = newChildren;
    this.setState({
      types: [...newTypes],
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAddNavTag = values => {
    const { navs } = this.state;
    this.setState({
      navs: [...navs, { ...values }],
    });
    this.handleModalVisible(false);
  };

  handeRemoveNavTag = index => {
    const { navs } = this.state;
    const newNavs = navs.filter((val, idx) => idx !== index);
    this.setState({
      navs: [...newNavs],
    });
  };

  handleMoveNavTag = (dragIndex, hoverIndex) => {
    const { navs } = this.state;
    const dragRow = navs[dragIndex];
    const newList = update(navs, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    this.setState({
      navs: [...newList],
    });
  };

  render() {
    const { loading = false } = this.props;
    const { types, inputVisible, modalVisible, navs } = this.state;
    const formProps = {
      visible: modalVisible,
      onCancel: () => this.handleModalVisible(false),
      onSubmit: this.handleAddNavTag,
    };
    return (
      <PageHeaderWrapper>
        <Spin spinning={loading} delay={500}>
          <Card
            title="首页导航标签"
            extra={
              <Button
                type="primary"
                ghost
                block
                size="small"
                onClick={() => this.handleModalVisible(true)}
              >
                添加
              </Button>
            }
          >
            <DndContext
              dataSource={navs}
              dragType="navs"
              style={{ display: 'inline-block' }}
              moveRow={this.handleMoveNavTag}
              render={(nav, index) => (
                <div key={nav.key} className={styles.navTag}>
                  <Icon
                    type="close"
                    className={styles.navClose}
                    onClick={() => this.handeRemoveNavTag(index)}
                  />
                  <div>
                    {nav.icon ? (
                      <Avatar
                        size={50}
                        src={BaseImgUrl + nav.icon}
                        style={{ backgroundColor: nav.color }}
                      />
                    ) : (
                      <Avatar size={50} style={{ backgroundColor: nav.color }}>
                        {nav.name.substring(0, 1)}
                      </Avatar>
                    )}
                  </div>
                  <div className={styles.navName}>{nav.name}</div>
                </div>
              )}
            />
          </Card>
          <Card
            title="搜索推荐标签设置"
            bodyStyle={{ padding: 0 }}
            style={{ marginTop: 16 }}
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
            <DndContext
              dataSource={types}
              style={{ width: '100%', marginBottom: 8 }}
              dragType="parent"
              moveRow={this.handleMoveParent}
              render={(parent, index) => (
                <Card
                  title={parent.name}
                  extra={
                    <Popconfirm
                      title="确认删一级分类?"
                      onConfirm={() => {
                        this.handleRemove(index);
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
                  <DndContext
                    dataSource={parent.children}
                    dragType={`child${parent.name}`}
                    style={{ display: 'inline-block' }}
                    moveRow={(dindex, hindex) => this.handleMoveChildren(index, dindex, hindex)}
                    render={(child, childIndex) => (
                      <Tag
                        closable
                        style={{ cursor: 'move' }}
                        afterClose={() => this.handleClose(index, childIndex)}
                        className={styles.listTag}
                      >
                        {child.name}
                      </Tag>
                    )}
                  />
                  <Tag
                    onClick={() => this.handleShowInput(index)}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                    className={styles.listTag}
                  >
                    <Icon type="plus" />
                    添加
                  </Tag>
                </Card>
              )}
            />
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
        <IconTagFrom {...formProps} />
      </PageHeaderWrapper>
    );
  }
}

export default TypeSetting;
