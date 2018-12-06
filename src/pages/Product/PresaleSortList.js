import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { parse, stringify } from 'qs';
import QRCode from 'qrcode-react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Modal,
  Menu,
  Badge,
  Divider,
  Popconfirm,
  message,
  Select,
} from 'antd';
import update from 'immutability-helper';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragSortingTable from '@/components/DragSortingTable';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = {
  BEFORE: 'default',
  ING: 'processing',
  AFTER: 'success',
  CLOSE: 'warning',
  DELETE: 'error',
};
const status = {
  BEFORE: '未开始',
  ING: '进行中',
  AFTER: '已结束',
  CLOSE: '已关闭',
  DELETE: '已删除',
};

const StatusOptions = [];
for (const key in status) {
  if (key) {
    StatusOptions.push(
      <Option key={key} value={key}>
        {status[key]}
      </Option>
    );
  }
}

@connect(({ presale, loading }) => ({
  presale,
  loading: loading.models.presale,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    filters: {},
    currentPage: 1,
    pageSize: 10,
    expandForm: false,
    formValues: {},
    sorter: 'sort:+',
    modalVisible: false,
    qrcodeSrc: undefined,
    qrcodeTitle: undefined,
    modalTitle: undefined,
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
  };

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
      type: 'presale/find',
      payload: params,
    });
  };

  handleClose = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/close',
      payload: { i },
      callback: () => {
        this.loadData();
      },
    });
  };

  handleOpen = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/open',
      payload: { i },
      callback: () => {
        this.loadData();
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
      this.loadData
    );
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState(
      {
        formValues: {},
        filters: {},
        sorter: 'sort:+',
        currentPage: 1,
      },
      this.loadData
    );
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        title: fieldsValue.title && ['like', fieldsValue.title],
        product_person_name: fieldsValue.product_person_name && [
          'like',
          fieldsValue.product_person_name,
        ],
        supplier_name: fieldsValue.supplier_name && ['like', fieldsValue.supplier_name],
        state:
          fieldsValue.state && fieldsValue.state.length ? ['in', fieldsValue.state] : undefined,
        texture:
          fieldsValue.texture && fieldsValue.texture.length
            ? ['in', fieldsValue.texture]
            : undefined,
        type: fieldsValue.type && fieldsValue.type.length ? ['in', fieldsValue.type] : undefined,
      };
      this.setState(
        {
          formValues: values,
          currentPage: 1,
        },
        this.loadData
      );
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handlePreview = record => {
    this.setState({
      modalVisible: true,
      modalTitle: '产品预览',
      qrcodeTitle: record.title,
      qrcodeSrc: `http://${location.host}/m/presale_details.html?i=${record.i}&preview=true`,
    });
  };

  handleBookByEcodeUrl = record => {
    this.setState({
      modalVisible: true,
      modalTitle: '电子码预约网址',
      qrcodeTitle: record.title,
      qrcodeSrc: `http://${location.host}/m/use_by_ecode.html?i=${record.i}`,
    });
  };

  handleBookByPhoneUrl = record => {
    this.setState({
      modalVisible: true,
      modalTitle: '手机号预约网址',
      qrcodeTitle: record.title,
      qrcodeSrc: `http://${location.host}/m/ecode_book.html?i=${record.i}`,
    });
  };

  handleEdit = (type, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/editPresale',
      payload: { type, record },
    });
  };

  handleWechatPush = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/wechatPush',
      payload: {
        i,
      },
      callback: () => {
        message.success('推送成功');
      },
    });
  };

  moveRow = (dragIndex, hoverIndex) => {
    const {
      presale: {
        data: { list },
      },
      dispatch,
    } = this.props;
    const { pageSize, currentPage } = this.state;
    const dragRow = list[dragIndex];
    const tempList = update(list, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    const newList = tempList.map((val, index) => {
      return {
        ...val,
        sort: pageSize * (currentPage - 1) + index + 1,
      };
    });
    const len = newList.length;
    dispatch({
      type: 'presale/dragSorting',
      payload: { list: newList },
      callback: () => {
        let count = 0;
        newList.forEach(val => {
          dispatch({
            type: 'presale/postSorting',
            payload: {
              i: val.i,
              sort: val.sort,
            },
            callback: () => {
              count += 1;
              if (count === len) {
                message.success('排序成功');
              }
            },
          });
        });
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
      handler: '/v2/admin/item/rush',
      message: JSON.stringify(params),
    };
    window.open(`http://${location.host}/csv?${stringify(msg)}`);
  };

  columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      sorter: true,
    },
    {
      title: 'id',
      sorter: true,
      dataIndex: 'i',
    },
    {
      title: '预售名称',
      dataIndex: 'title',
      render: val => (
        <Ellipsis length={25} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      sorter: true,
      render: val => `${val / 100}`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '佣金',
      dataIndex: 'commission',
      sorter: true,
      render: val => `${val / 100}`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '产品人',
      dataIndex: 'product_person_name',
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
    },
  ];

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="id">{getFieldDecorator('i')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="id">{getFieldDecorator('i')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品人">
              {getFieldDecorator('product_person_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="供应商">
              {getFieldDecorator('supplier_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(
                <Select style={{ width: '100%' }} mode="multiple">
                  {StatusOptions}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              icon="download"
              ghost
              type="primary"
              onClick={this.handleExport}
            >
              导出
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      presale: {
        data: { list, pagination },
      },
      loading,
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => (
        <span>
          <Button
            icon="sync"
            shape="circle"
            size="small"
            type="dashed"
            onClick={this.loadData}
            style={{ marginRight: 8 }}
            title="刷新"
            loading={loading}
          />
          <span>
            共 <span style={{ color: '#1890ff' }}>{total}</span> 条数据
          </span>
        </span>
      ),
      ...pagination,
    };

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <DragSortingTable
              moveRow={this.moveRow}
              rowKey="i"
              loading={loading}
              dataSource={list}
              pagination={paginationProps}
              columns={this.columns}
              onChange={this.handleTableChange}
              scroll={{ x: 1500 }}
              expandedRowRender={record => (
                <Row gutter={16} type="flex" justify="start">
                  <Col span={4}>
                    <div>预售时间</div>
                    <div>
                      {record.rush_begin_time.substring(0, 10)}~
                      {record.rush_end_time.substring(0, 10)}
                    </div>
                  </Col>
                  <Col span={4}>
                    <div>发码时间</div>
                    <div>{record.send_code_time.substring(0, 10)}</div>
                  </Col>
                  <Col span={4}>
                    <div>使用时间</div>
                    <div>
                      {record.use_begin_time.substring(0, 10)}~
                      {record.use_end_time.substring(0, 10)}
                    </div>
                  </Col>
                  <Col span={4}>
                    <div>预售数量</div>
                    <div>{record.inventory}</div>
                  </Col>
                  <Col span={4}>
                    <div>已售数量</div>
                    <div>{record.sales}</div>
                  </Col>
                  <Col span={4}>
                    <div>满减优惠</div>
                    <div>{`满${record.discount_limit_num}减${record.discount_reduce / 100}`}</div>
                  </Col>
                  <Col span={4}>
                    <div>最小购买数量</div>
                    <div>{record.min_pay_num}</div>
                  </Col>
                  <Col span={4}>
                    <div>最大购买数量</div>
                    <div>{record.max_pay_num}</div>
                  </Col>
                  <Col span={4}>
                    <div>每份电子码</div>
                    <div>{record.create_ecode_num}</div>
                  </Col>
                </Row>
              )}
            />
          </div>
        </Card>
        <Modal
          title={this.state.modalTitle}
          visible={this.state.modalVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
          destroyOnClose
          footer={null}
        >
          <div style={{ textAlign: 'center' }}>
            <div>{this.state.qrcodeTitle}</div>
            <div style={{ margin: '10px' }}>
              <a href={this.state.qrcodeSrc}>{this.state.qrcodeSrc}</a>
            </div>
            <div style={{ display: 'inline-block', marginLeft: 'auto', marginRight: 'auto' }}>
              <QRCode value={this.state.qrcodeSrc} />
            </div>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
