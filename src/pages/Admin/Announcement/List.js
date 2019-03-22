import React, { Component } from 'react';
import { connect } from 'dva';
import { parse, stringify } from 'qs';
import { Table, Card, Form, Modal, Input, message, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { Editor } from '@/components/FormItems/Editor';
import { searchItems } from './Search/items';

import styles from './style.less';

const FormItem = Form.Item;

const AddForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible, initVal, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (initVal.i) {
        values.i = initVal.i;
        handleEdit(values);
      } else {
        handleAdd(values);
      }
    });
  };
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
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
      <FormItem {...layout} label="公告标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入公告标题' }],
          initialValue: initVal.title,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <Editor
        form={form}
        formItemLayout={layout}
        initialValue={initVal.content}
        name="content"
        label="公告内容"
      />
    </Modal>
  );
});

@connect(({ loading }) => ({
  loading: loading.models.adminAnnouncement,
}))
class AnnouncementList extends Component {
  constructor(props) {
    super(props);
    const {
      location: { search },
    } = props;
    this.state = {
      currentPage: 1,
      pageSize: 10,
      formValues: {},
      filters: {},
      sorter: undefined,
      query: parse(search, { ignoreQueryPrefix: true }),
      data: {
        sum: {},
        list: [],
        pagination: {},
      },
      modalVisible: false,
      current: {},
    };

    this.columns = [
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => val && val.substring(0, 19),
      },
      {
        title: 'id',
        dataIndex: 'i',
      },
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '操作',
        render: (val, record) => <a onClick={() => this.handleShowModal(record)}>详情</a>,
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
      type: 'adminAnnouncement/find',
      payload: params,
      callback: data => {
        this.setState({
          data,
        });
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

  handleExport = () => {
    const { filters, sorter, query } = this.state;
    this.searchForm.getFormValue(values => {
      const params = {
        order: sorter,
        ...query,
        ...values,
        ...filters,
      };
      const msg = {
        handler: '/v1/mp/user/salesman',
        message: JSON.stringify(params),
      };
      window.open(`http://${location.host}/csv?${stringify(msg)}`);
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleShowModal = ann => {
    this.setState({
      modalVisible: true,
      current: { ...ann },
    });
  };

  handleAdd = fileds => {
    const { dispatch } = this.props;
    const params = {
      ...fileds,
    };
    dispatch({
      type: 'adminAnnouncement/add',
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

  handleEdit = fileds => {
    const { dispatch } = this.props;
    const params = {
      ...fileds,
    };
    dispatch({
      type: 'adminAnnouncement/edit',
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

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      data: { list, pagination },
      current,
      modalVisible,
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => (
        <span>
          <span>
            <span>共</span>
            <span style={{ color: '#1890ff' }}>{total}</span>
            <span>条数据</span>
          </span>
        </span>
      ),
      ...pagination,
    };

    const addMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      initVal: current,
      modalVisible,
      loading,
    };

    return (
      <PageHeaderWrapper>
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
              type="primary"
              onClick={() => this.handleShowModal({})}
              style={{ marginBottom: 16 }}
            >
              添加
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
        <AddForm {...addMethods} />
      </PageHeaderWrapper>
    );
  }
}

export default AnnouncementList;
