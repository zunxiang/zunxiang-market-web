import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
  Radio,
  Avatar,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const statusMap = ['error', 'success'];
const status = ['禁用', '正常'];

const AddForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible } = props;
  const { initval, powers } = props;
  const Powers = powers.map(p => <Option key={p.value}>{p.text}</Option>);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (initval.username) {
        handleEdit(fieldsValue);
      } else {
        handleAdd(fieldsValue);
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
    if (initval.username) {
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
      title="新建子账号"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        form.resetFields();
        handleModalVisible();
      }}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入姓名' }],
          initialValue: initval.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '请输入手机号' }, { validator: checkPhone }],
          initialValue: initval.mobile,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="查看权限">
        {form.getFieldDecorator('view_power', {
          rules: [{ required: true, message: '请至少选择一项权限', type: 'array' }],
          initialValue: initval.view_power,
        })(
          <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择权限">
            {powers.map(p => (
              <Option key={p.value}>{p.text}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作权限">
        {form.getFieldDecorator('set_power', {
          rules: [{ required: false, message: '请至少选择一项权限', type: 'array' }],
          initialValue: initval.set_power || [],
        })(
          <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择权限">
            {Powers}
          </Select>
        )}
      </FormItem>
      {renderRestePassword(form)}
    </Modal>
  );
});

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    filters: {},
    currentPage: 1,
    pageSize: 10,
    formValues: {},
    modalVisible: false,
    currentKey: undefined,
    accountInfo: {},
    powers: [],
    data: {
      sum: {},
      list: [],
      pagination: {},
    },
  };

  columns = [
    {
      title: 'id',
      dataIndex: 'i',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机',
      dataIndex: 'mobile',
    },
    {
      title: '状态',
      dataIndex: 'state',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '最后登录',
      dataIndex: 'last_login_time',
    },
    {
      title: '微信绑定',
      dataIndex: 'logo',
      render: (val, record) => (record.wxopenid ? <Avatar src={val} /> : '未绑定'),
    },
    {
      title: '操作',
      render: (val, row) => (
        <Fragment>
          <a onClick={() => this.handleEditEvent(row)}>修改信息</a>
          <Divider type="vertical" />
          {row.state === 1 ? (
            <Popconfirm
              title="确认禁用该账号?"
              onConfirm={() => this.handleClose(row.i)}
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
              onConfirm={() => this.handleOpen(row.i)}
              okText="确认"
              cancelText="取消"
            >
              <a style={{ color: '#5b8c00' }}>启用</a>
            </Popconfirm>
          )}
          {row.wxopenid && (
            <Fragment>
              <Divider type="vertical" />
              <Popconfirm
                title="确认解绑该账号的微信订阅?"
                onConfirm={() => this.handleUnbind(row.i)}
                okText="确认"
                cancelText="取消"
              >
                <a style={{ color: '#f5222d' }}>解绑</a>
              </Popconfirm>
            </Fragment>
          )}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.loadData();
    dispatch({
      type: 'account/getAllPower',
      payload: {},
      callback: data => {
        this.setState({
          powers: [...data],
        });
      },
    });
  }

  loadData = () => {
    const { dispatch } = this.props;
    const { formValues, filters, pageSize, currentPage, sorter } = this.state;
    const params = {
      currentPage,
      pageSize,
      order: sorter,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'account/find',
      payload: params,
      callback: data => {
        this.setState({
          data,
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
      accountInfo: {},
      currentKey: undefined,
    });
  };

  handleAdd = fileds => {
    const { dispatch } = this.props;
    const params = {
      ...fileds,
      view_power: fileds.view_power.join(','),
      set_power: fileds.set_power.join(','),
    };
    dispatch({
      type: 'account/add',
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

  handleEditEvent = account => {
    const { i, name, username, mobile } = account;
    this.setState({
      currentKey: i,
      accountInfo: {
        name,
        username,
        mobile,
        view_power: account.view_power.split(','),
        set_power: account.set_power.split(','),
      },
      modalVisible: true,
    });
  };

  handleEdit = fileds => {
    const { dispatch } = this.props;
    const { currentKey } = this.state;
    const params = {
      ...fileds,
      i: currentKey,
      view_power: fileds.view_power.join(','),
      set_power: fileds.set_power.join(','),
    };
    delete params.username;
    dispatch({
      type: 'account/edit',
      payload: params,
      callback: () => {
        this.loadData();
        this.setState({
          modalVisible: false,
          accountInfo: {},
          currentKey: undefined,
        });
        message.success('编辑成功');
      },
    });
  };

  handlePaginationChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
        pageSize,
      },
      this.loadData
    );
  };

  handlePageSizeChange = (current, size) => {
    this.setState(
      {
        currentPage: 1,
        pageSize: size,
      },
      this.loadData
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
    const { dispatch } = this.props;
    dispatch({
      type: 'account/edit',
      payload: { i, state: 1 },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleClose = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/edit',
      payload: { i, state: 0 },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleUnbind = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/unbind',
      payload: { i },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      modalVisible,
      accountInfo,
      powers,
      data: { list, pagination },
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.handlePaginationChange,
      onShowSizeChange: this.handlePageSizeChange,
      showTotal: total => (
        <span>
          <span>共</span>
          <span style={{ color: '#1890ff' }}>{total}</span>
          <span>条数据</span>
        </span>
      ),
      ...pagination,
    };
    const addMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      powers,
      initval: accountInfo,
    };
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              items={searchItems}
              onSubmit={this.handleSearch}
              onReset={this.handleFormReset}
              onMounted={self => {
                this.searchForm = self;
              }}
              onRefresh={this.loadData}
            />
            <Button
              onClick={() => this.handleAddEvent()}
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
            />
          </div>
        </Card>
        <AddForm {...addMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
