import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Popconfirm, Input, Button, Modal, Form, Select } from 'antd';
import update from 'immutability-helper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragSortingTable from '@/components/DragSortingTable';
import UploadImgFormItem from '@/components/FormItems/UploadImg';
import { BaseImgUrl } from '@/common/config';
import styles from './Style.less';

const FormItem = Form.Item;
const { Option } = Select;

const mpTypes = {
  detail: '产品详情',
  list: '搜索列表',
};
const AddForm = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, handleAdd } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        ...fieldsValue,
        img_id: fieldsValue.img_id[0].response.hash,
        link: fieldsValue.link && `http://${fieldsValue.link}`,
      };
      handleAdd(params);
      form.resetFields();
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleModalVisible(false);
  };

  const prefixSelector = form.getFieldDecorator('mp_type', {
    initialValue: 'detail',
  })(
    <Select style={{ width: 100 }}>
      <Option value="detail">产品详情</Option>
      <Option value="list">搜索列表</Option>
    </Select>
  );
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
      <UploadImgFormItem
        label="轮播图片"
        name="img_id"
        error="请上传轮播图片"
        max={1}
        getFieldDecorator={form.getFieldDecorator}
      />
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="跳转地址">
        {form.getFieldDecorator('link', {
          rules: [{ required: false, message: '请输入跳转链接' }],
        })(<Input addonBefore="http://" placeholder="公众号网页商城跳转地址" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="小程序跳转"
        help="跳转详情请输入产品id，列表请输入关键字"
      >
        {form.getFieldDecorator('mp_link', {
          rules: [{ required: false, message: '请输入跳转链接' }],
        })(<Input addonBefore={prefixSelector} placeholder="请输入" />)}
      </FormItem>
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
    banners: [],
  };

  columns = [
    {
      title: '轮播图片',
      dataIndex: 'img_id',
      width: 200,
      render: val => <img src={BaseImgUrl + val} alt="轮播图片" style={{ width: 200 }} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '网页跳转链接',
      dataIndex: 'link',
    },
    {
      title: '小程序跳转类型',
      dataIndex: 'mp_type',
      render: val => mpTypes[val],
    },
    {
      title: '小程序跳转值',
      dataIndex: 'mp_link',
    },
    {
      title: '操作',
      render: (val, record, index) => (
        <Fragment>
          <Popconfirm
            title="确认删除改轮播图?"
            onConfirm={() => this.handleDelete(index)}
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
  }

  loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'banner/get',
      payload: {},
      callback: list => {
        this.setState({
          banners: [...list],
        });
      },
    });
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { dispatch } = this.props;
    const { banners } = this.state;
    const dragRow = banners[dragIndex];
    const newList = update(banners, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    dispatch({
      type: 'banner/set',
      payload: { banner: newList },
      callback: () => {
        this.setState({
          banners: [...newList],
        });
        message.success('排序成功');
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = values => {
    const { dispatch } = this.props;
    const { banners } = this.state;
    const newBanners = [
      ...banners,
      {
        ...values,
        key: Math.random()
          .toString(36)
          .slice(2, 10),
      },
    ];
    dispatch({
      type: 'banner/set',
      payload: {
        banner: newBanners,
      },
      callback: () => {
        this.loadData();
        this.handleModalVisible(false);
        message.success('添加成功');
      },
    });
  };

  handleDelete = index => {
    const { dispatch } = this.props;
    const { banners } = this.state;
    const newBanners = banners.filter((val, ind) => index !== ind);
    dispatch({
      type: 'banner/set',
      payload: {
        banner: newBanners,
      },
      callback: () => {
        this.setState({
          banners: [...newBanners],
        });
        message.success('删除成功');
      },
    });
  };

  render() {
    const { modalVisible, banners } = this.state;
    const addMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
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
            dataSource={banners}
            columns={this.columns}
            moveRow={this.moveRow}
            rowKey="key"
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
        <AddForm {...addMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
