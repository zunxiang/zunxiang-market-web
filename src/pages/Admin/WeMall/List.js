import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { parse, stringify } from 'qs';
import {
  Table,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
  Radio,
} from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './List.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const statusMap = ['error', 'success'];
const status = ['禁用', '正常'];

const AddForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible, initVal, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        // merchant: fieldsValue.merchant.join(','),
        wx_tmplmsg: JSON.stringify(JSON.parse(fieldsValue.wx_tmplmsg)),
      };
      if (initVal.username) {
        handleEdit(values);
      } else {
        handleAdd(values);
      }
    });
  };
  const checkPhone = (rule, value, callback) => {
    if (/^\d{11}$/g.test(value)) {
      callback();
    } else {
      callback('请输入正确的手机号码');
    }
  };
  const renderRestePassword = () => {
    if (initVal.username) {
      return (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="重置密码">
          {form.getFieldDecorator('reset_password', {
            initialValue: 0,
          })(
            <RadioGroup>
              <Radio value={1}>重置</Radio>
              <Radio value={0}>不重置</Radio>
            </RadioGroup>
          )}
        </FormItem>
      );
    }
    return '';
  };
  return (
    <Modal
      title="公众号信息设置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      destroyOnClose
      width={1000}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商城域名">
        {form.getFieldDecorator('domain', {
          rules: [{ required: true, message: '请输入公众号名称' }],
          initialValue: initVal.domain,
        })(<Input placeholder="请输入" addonBefore="http://" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="公众号名称">
        {form.getFieldDecorator('subscription_name', {
          rules: [{ required: true, message: '请输入公众号名称' }],
          initialValue: initVal.subscription_name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="公众号APPID">
        {form.getFieldDecorator('wx_appid', {
          rules: [{ required: true, message: '请输入公众号APPID' }],
          initialValue: initVal.wx_appid,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="公众号KEY">
        {form.getFieldDecorator('wx_key', {
          rules: [{ required: true, message: '请输入公众号KEY' }],
          initialValue: initVal.wx_key,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="公众号TOKEN">
        {form.getFieldDecorator('wx_token', {
          rules: [{ required: true, message: '请输入公众号TOKEN' }],
          initialValue: initVal.wx_token,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="小程序APPID">
        {form.getFieldDecorator('miniprogram_appid', {
          rules: [{ required: false, message: '请输入小程序APPID' }],
          initialValue: initVal.miniprogram_appid,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="小程序KEY">
        {form.getFieldDecorator('miniprogram_key', {
          rules: [{ required: false, message: '请输入小程序KEY' }],
          initialValue: initVal.miniprogram_key,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="微信商户id">
        {form.getFieldDecorator('wx_pay_mchid', {
          rules: [{ required: true, message: '请输入微信商户id' }],
          initialValue: initVal.wx_pay_mchid,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="微信支付KEY">
        {form.getFieldDecorator('wx_pay_key', {
          rules: [{ required: true, message: '请输入微信支付KEY' }],
          initialValue: initVal.wx_pay_key,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="汇聚商户id">
        {form.getFieldDecorator('huiju_mchid', {
          rules: [{ required: true, message: '请输入汇聚商户' }],
          initialValue: initVal.huiju_mchid,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="汇聚支付KEY">
        {form.getFieldDecorator('huiju_key', {
          rules: [{ required: true, message: '请输入汇聚支付KEY' }],
          initialValue: initVal.huiju_key,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="短信商户id">
        {form.getFieldDecorator('sms_mchid', {
          rules: [{ required: true, message: '请输入汇聚商户' }],
          initialValue: initVal.sms_mchid,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="短信KEY">
        {form.getFieldDecorator('sms_key', {
          rules: [{ required: true, message: '请输入汇聚支付KEY' }],
          initialValue: initVal.sms_key,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人">
        {form.getFieldDecorator('contacts', {
          rules: [{ required: true, message: '请输联系人' }],
          initialValue: initVal.contacts,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
        {form.getFieldDecorator('contacts_mobile', {
          rules: [{ required: true, message: '请输入手机号' }, { validator: checkPhone }],
          initialValue: initVal.contacts_mobile,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="百度统计id">
        {form.getFieldDecorator('baidutongji_id', {
          rules: [{ required: false, message: '请输入百度统计id' }],
          initialValue: initVal.baidutongji_id,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="微信推送模板">
        {form.getFieldDecorator('wx_tmplmsg', {
          rules: [{ required: true, message: '请输入微信推送模板' }],
          initialValue: initVal.wx_tmplmsg,
        })(<Input.TextArea placeholder="请输入" autosize={{ minRows: 5 }} />)}
      </FormItem>
      {renderRestePassword(form)}
    </Modal>
  );
});

@connect(({ adminWemall, loading }) => ({
  adminWemall,
  loading: loading.models.adminWemall,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      currentPage: 1,
      pageSize: 10,
      formValues: {},
      modalVisible: false,
      weMallInfo: {},
      query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
      data: {
        list: [],
        pagination: {},
      },
    };
    this.columns = [
      {
        title: 'id',
        dataIndex: 'i',
        width: 50,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        width: 100,
      },
      {
        title: '公众号名称',
        dataIndex: 'subscription_name',
        width: 200,
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
        width: 100,
      },
      {
        title: '手机',
        dataIndex: 'contacts_mobile',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 80,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '创建时间',
        wdith: 120,
        dataIndex: 'create_time',
        render: val => val && val.substring(0, 10),
      },
      {
        title: '操作',
        width: 300,
        fixed: 'right',
        render: (val, record) => (
          <Fragment>
            {record.state === 1 ? (
              <Popconfirm
                title="确认禁用该账号?"
                onConfirm={() => this.handleClose(record.i)}
                okText="确认"
                cancelText="取消"
              >
                <a style={{ color: '#f5222d' }} href="#">
                  禁用
                </a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="确认启用该账号?"
                onConfirm={() => this.handleOpen(record.i)}
                okText="确认"
                cancelText="取消"
              >
                <a style={{ color: '#5b8c00' }}>启用</a>
              </Popconfirm>
            )}
            <Divider type="vertical" />
            <a onClick={() => this.handleEditEvent(record)}>修改信息</a>
            <Divider type="vertical" />
            <a>查看商品</a>
            <Divider type="vertical" />
            <a>查看订单</a>
          </Fragment>
        ),
      },
    ];
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { dispatch } = this.props;
    const { formValues, filters, pageSize, currentPage, sorter, query } = this.state;
    const params = {
      currentPage,
      pageSize,
      order: sorter,
      ...query,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'adminWemall/find',
      payload: params,
      callback: data => {
        this.setState({
          data: { ...data },
        });
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAddEvent = () => {
    this.setState({
      modalVisible: true,
      weMallInfo: {},
    });
  };

  handleAdd = fileds => {
    console.log(fileds);
    const { dispatch } = this.props;
    const params = {
      ...fileds,
    };
    dispatch({
      type: 'adminWemall/add',
      payload: params,
      callback: () => {
        this.loadData();
        this.setState({
          modalVisible: false,
        });
        message.success('添加成功');
      },
    });
  };

  handleEditEvent = weMall => {
    this.setState({
      weMallInfo: {
        ...weMall,
      },
      modalVisible: true,
    });
  };

  handleEdit = fileds => {
    const { dispatch } = this.props;
    const {
      weMallInfo: { i },
    } = this.state;
    const params = {
      ...fileds,
      i,
    };
    dispatch({
      type: 'adminWemall/edit',
      payload: params,
      callback: () => {
        this.loadData();
        this.setState({
          modalVisible: false,
          weMallInfo: {},
        });
        message.success('编辑成功');
      },
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = filtersArg[key].length > 0 ? ['in', filtersArg[key]] : undefined;
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}:${sorter.order === 'ascend' ? '+' : '-'}`;
    }
    this.setState(
      {
        ...params,
      },
      () => {
        this.loadData();
      }
    );
  };

  handleSearch = values => {
    this.setState(
      {
        formValues: values,
        currentPage: 1,
      },
      this.loadData
    );
  };

  handleOpen = i => {
    this.props.dispatch({
      type: 'adminWemall/edit',
      payload: {
        i,
        state: 1,
      },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleClose = i => {
    this.props.dispatch({
      type: 'adminWemall/edit',
      payload: {
        i,
        state: 0,
      },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleExport = () => {
    const { formValues, filters, sorter, query } = this.state;
    const params = {
      order: sorter,
      ...query,
      ...formValues,
      ...filters,
    };
    const msg = {
      handler: '/v2/admin/app/app',
      message: JSON.stringify(params),
    };
    window.open(`http://${location.host}/csv?${stringify(msg)}`);
  };

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      modalVisible,
      weMallInfo,
      query,
      data: { list, pagination },
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => (
        <span>
          共 <span style={{ color: '#1890ff' }}>{total}</span> 条数据
        </span>
      ),
      ...pagination,
    };
    const addMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      initVal: weMallInfo,
      modalVisible,
      loading,
    };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              items={searchItems}
              values={{ ...query }}
              onSubmit={this.handleSearch}
              onMounted={self => {
                this.searchForm = self;
              }}
              onRefresh={this.loadData}
              extra={
                <Button
                  style={{ marginLeft: 8 }}
                  icon="download"
                  ghost
                  type="primary"
                  onClick={this.handleExport}
                >
                  导出
                </Button>
              }
            />
            <Button
              onClick={this.handleAddEvent}
              style={{ width: '100%', marginBottom: 16 }}
              icon="plus"
              ghost
              type="primary"
            >
              新建
            </Button>
            <Table
              selectedRows={selectedRows}
              rowKey={record => record.i}
              loading={loading}
              dataSource={list}
              pagination={paginationProps}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
              scroll={{ x: 1300 }}
            />
          </div>
        </Card>
        <AddForm {...addMethods} />
      </PageHeaderLayout>
    );
  }
}
