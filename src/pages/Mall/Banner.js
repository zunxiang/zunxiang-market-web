import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Popconfirm, Input, Button, Modal, Form, Table, Dropdown, Menu } from 'antd';
import update from 'immutability-helper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragSortingTable from '@/components/DragSortingTable';
import UploadImgFormItem from '@/components/FormItems/UploadImg';
import { BaseImgUrl } from '@/common/config';
import styles from './Style.less';

const FormItem = Form.Item;

const adPostions = {
  index: '首页',
  presale_details: '预售详情页',
  item_details: '常规详情页',
  center: '个人中心',
  pay_success: '支付成功页',
};

const AddForm = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, handleAdd } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        ...fieldsValue,
        img_id: fieldsValue.img_id[0].response.hash,
        link: `http://${fieldsValue.link}`,
      };
      handleAdd(params);
      form.resetFields();
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleModalVisible(false);
  };
  return (
    <Modal
      title="添加轮播图"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入轮播图标题' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="跳转地址">
        {form.getFieldDecorator('link', {
          rules: [{ required: true, message: '请输入跳转链接' }],
        })(<Input addonBefore="http://" placeholder="请输入" />)}
      </FormItem>
      <UploadImgFormItem
        label="轮播图片"
        name="img_id"
        error="请上传轮播图片"
        max={1}
        getFieldDecorator={form.getFieldDecorator}
      />
    </Modal>
  );
});

const CreateAdForm = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, handleAdd, position } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        ...fieldsValue,
        img_id: fieldsValue.img_id[0].response.hash,
        link: fieldsValue.link ? `http://${fieldsValue.link}` : '',
        title: '',
        position,
      };
      handleAdd(params);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleModalVisible(false);
  };
  return (
    <Modal
      title="添加广告"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
      afterClose={() => form.resetFields()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="弹窗页面">
        {form.getFieldDecorator('position', {
          rules: [{ required: true, message: '请输入弹出页面' }],
          initialValue: adPostions[position],
        })(<Input placeholder="请输入" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="跳转链接">
        {form.getFieldDecorator('link', {})(<Input addonBefore="http://" placeholder="可不填" />)}
      </FormItem>
      <UploadImgFormItem
        label="弹出图片"
        name="img_id"
        error="请上传弹出图片"
        max={1}
        getFieldDecorator={form.getFieldDecorator}
      />
    </Modal>
  );
});

@connect(({ banner, loading }) => ({
  banner,
  loading: loading.models.banner,
}))
export default class BasicList extends PureComponent {
  state = {
    modalVisible: false,
    adModalVisible: false,
    adPosion: 'index',
  };

  columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      render: (val, record, index) => index + 1,
    },
    {
      title: '轮播图片',
      dataIndex: 'img_id',
      render: val => <img src={BaseImgUrl + val} alt="轮播图片" style={{ width: 100 }} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '跳转链接',
      dataIndex: 'link',
    },
    {
      title: '操作',
      render: (val, record, index) => (
        <Fragment>
          <Popconfirm
            title="确认删除改轮播图?"
            onConfirm={() => this.handleDelete(record.i, index)}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: '#f5222d' }}>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  adColumns = [
    {
      title: 'id',
      dataIndex: 'i',
    },
    {
      title: '广告图片',
      dataIndex: 'img_id',
      render: val => <img src={BaseImgUrl + val} alt="轮播图片" style={{ width: 100 }} />,
    },
    {
      title: '展示页面',
      dataIndex: 'position',
      render: val => adPostions[val],
    },
    {
      title: '跳转链接',
      dataIndex: 'link',
    },
    {
      title: '操作',
      render: (val, record, index) => (
        <Fragment>
          <Popconfirm
            title="确认删除改轮播图?"
            onConfirm={() => this.handleDeleteAd(record.i, index)}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: '#f5222d' }}>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
    this.loadAds();
  }

  loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/find',
      payload: {
        currentPage: 1,
        pageSize: 99,
        order: 'sort:+num',
      },
    });
  };

  loadAds = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/findAd',
      payload: {
        currentPage: 1,
        pageSize: 99,
      },
    });
  };

  moveRow = (dragIndex, hoverIndex) => {
    const {
      banner: {
        data: { list },
      },
      dispatch,
    } = this.props;
    const dragRow = list[dragIndex];
    const newList = update(list, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    dispatch({
      type: 'banner/dragSorting',
      payload: { list: newList },
      callback: () => {
        const sendList = newList.map((val, index) => ({
          i: val.i,
          sort: index,
        }));
        dispatch({
          type: 'banner/postSorting',
          payload: sendList,
          callback: () => {
            message.success('排序成功');
          },
        });
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdModalVisible = flag => {
    this.setState({
      adModalVisible: !!flag,
    });
  };

  handleAdd = values => {
    const {
      dispatch,
      banner: {
        data: { list },
      },
    } = this.props;
    dispatch({
      type: 'banner/add',
      payload: {
        ...values,
        sort: list.length + 1,
      },
      callback: () => {
        this.loadData();
        this.handleModalVisible(false);
        message.success('添加成功');
      },
    });
  };

  handleDelete = (i, index) => {
    const {
      banner: {
        data: { list },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'banner/delete',
      payload: { i },
      callback: () => {
        list.splice(index, 1);
        dispatch({
          type: 'banner/dragSorting',
          payload: { list },
          callback: () => {
            message.success('删除成功');
          },
        });
      },
    });
  };

  handleCreateAdEvent = position => {
    const {
      banner: { popupAds },
    } = this.props;
    let flag = true;
    popupAds.forEach(ad => {
      if (position === ad.position) {
        flag = false;
      }
    });
    if (flag) {
      this.setState({
        adPosion: position,
        adModalVisible: true,
      });
    } else {
      message.error('该页面已经添加过弹窗广告了');
    }
  };

  handleCreateAd = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/createAd',
      payload: {
        ...values,
      },
      callback: () => {
        this.loadAds();
        this.handleAdModalVisible(false);
        message.success('添加成功');
      },
    });
  };

  handleDeleteAd = (i, index) => {
    const {
      banner: { popupAds },
      dispatch,
    } = this.props;
    dispatch({
      type: 'banner/delete',
      payload: { i },
      callback: () => {
        popupAds.splice(index, 1);
      },
    });
  };

  renderCreateMenu = () => {
    const Items = [];
    for (const key in adPostions) {
      if (key) {
        Items.push(
          <Menu.Item key={key}>
            <a onClick={() => this.handleCreateAdEvent(key)}>{adPostions[key]}</a>
          </Menu.Item>
        );
      }
    }
    return <Menu>{Items}</Menu>;
  };

  render() {
    const {
      banner: {
        data: { list },
        popupAds,
      },
    } = this.props;
    const { modalVisible, adModalVisible, adPosion } = this.state;
    const addMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const createAdMethods = {
      handleAdd: this.handleCreateAd,
      handleModalVisible: this.handleAdModalVisible,
      position: adPosion,
    };
    return (
      <PageHeaderWrapper>
        <Card
          className={styles.listCard}
          bordered={false}
          title="轮播图列表"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0' }}
        >
          <DragSortingTable
            dataSource={list}
            columns={this.columns}
            moveRow={this.moveRow}
            rowKey="i"
            pagination={false}
          />
          <Button
            type="primary"
            onClick={() => this.handleModalVisible(true)}
            ghost
            style={{ width: '100%' }}
          >
            添加
          </Button>
        </Card>
        <Card
          className={styles.listCard}
          bordered={false}
          title="弹窗广告"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0' }}
        >
          <Table dataSource={popupAds} columns={this.adColumns} rowKey="i" pagination={false} />
          <Dropdown overlay={this.renderCreateMenu()}>
            <Button icon="plus" ghost type="primary" style={{ width: '100%' }}>
              添加
            </Button>
          </Dropdown>
        </Card>
        <AddForm {...addMethods} modalVisible={modalVisible} />
        <CreateAdForm {...createAdMethods} modalVisible={adModalVisible} />
      </PageHeaderWrapper>
    );
  }
}
