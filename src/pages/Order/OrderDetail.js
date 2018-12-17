import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import {
  Card,
  Table,
  Divider,
  Button,
  Input,
  Form,
  Modal,
  Upload,
  Icon,
  message,
  Select,
  Dropdown,
  Menu,
  Tabs,
} from 'antd';
import Ellipsis from 'components/Ellipsis';
import DescriptionList from 'components/DescriptionList';
import QRCode from 'qrcode-react';
import PrintTable from '@/omponents/PrintComponents/WithTableLayout';
import FranchiserCallback from '@/omponents/PrintComponents/FranchiserCallback';
import NewWindow from '@/components/NewWindow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { billColums } from '../Finance/common/status';
import { payWay } from './payWay';
import styles from './OrderDetail.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

const skusColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    editable: false,
    render: val => val.substring(0, 10),
  },
  {
    title: '价格',
    dataIndex: 'price',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
  {
    title: '成本',
    dataIndex: 'cost',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
];
const groupSkusColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    editable: false,
    render: val => val.substring(0, 10),
  },
  {
    title: '成人价格',
    dataIndex: 'price',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
  {
    title: '成人成本',
    dataIndex: 'cost',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
  {
    title: '儿童价格',
    dataIndex: 'child_price',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
  {
    title: '儿童成本',
    dataIndex: 'child_cost',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
];

const visitorColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '身份证号',
    dataIndex: 'id_no',
  },
];

const logColumns = [
  {
    title: '操作时间',
    dataIndex: 'create_time',
    render: val => val.substring(0, 19),
  },
  {
    title: 'title',
    dataIndex: 'title',
  },
  {
    title: '内容',
    dataIndex: 'content',
    render: val => (
      <Ellipsis length={30} tooltip>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '操作者',
    dataIndex: 'operator',
  },
];
const additionalColumns = [
  {
    title: '项目名称',
    dataIndex: 'title',
  },
  {
    title: '价格',
    dataIndex: 'price',
    render: val => val / 100,
  },
  {
    title: '成本',
    dataIndex: 'cost',
    render: val => val / 100,
  },
  {
    title: '数量',
    dataIndex: 'num',
  },
];

const status = {
  WAIT: '待支付',
  SUCCESS: '已支付',
  EDITED: '已编辑',
  CANCEL: '已拒绝',
  HANDLING: '待确定',
  FINISH: '已确认',
  REQUEST_DELETE: '待撤销',
  DELETE: '已撤销',
  REQUEST_CHANGE: '待改约',
  CHANGE: '已改约',
  SETTLED: '已结算',
  CLOSED: '已关闭',
};
const sources = {
  ONLINE: '在线购买',
  AGENT: '代客下单',
  IMPORT: '后台导入',
};

const CallbackPreprint = Form.create()(props => {
  const { form, onSubmit, modalVisible, handleModalVisible } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onSubmit(fieldsValue);
    });
  };
  return (
    <Modal
      title="分销回执信息修改"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      okText="打印预览"
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="取消条款">
        {getFieldDecorator('callbackCancelrule', {
          initialValue: '一经预订不可更改或取消。',
        })(<Input.TextArea rows={3} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {getFieldDecorator('callbackRemark', {
          initialValue: '此单已确认，保证入住全段，不可更改或取消，NO SHOW 房费照付，谢谢。',
        })(<Input.TextArea rows={3} />)}
      </FormItem>
    </Modal>
  );
});

const ChangeSupplierForm = Form.create()(props => {
  const { modalVisible, form, onSubmit, onSearch, handleModalVisible, suppliers } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onSubmit(fieldsValue);
    });
  };
  const supplierOptions = suppliers.map(val => (
    <Option key={val.name} value={val.i}>
      {val.name}
    </Option>
  ));
  return (
    <Modal
      title="修改供应商"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="选择供应商">
        {getFieldDecorator('supplier_i', {
          rules: [{ required: true, message: '请搜索并选择供应商' }],
        })(
          <Select
            showSearch
            placeholder="输入供应商进行搜索"
            style={{ width: '100%' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={onSearch}
            optionLabelProp="children"
          >
            {supplierOptions}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

const ChangeFranchiserForm = Form.create()(props => {
  const { modalVisible, form, onSubmit, onSearch, handleModalVisible, franchisers } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onSubmit(fieldsValue);
    });
  };
  const franchiserOptions = franchisers.map(val => (
    <Option key={val.name} value={val.i}>
      {val.name}
    </Option>
  ));
  return (
    <Modal
      title="修改分销商"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="选择分销商">
        {getFieldDecorator('franchiser_i', {
          rules: [{ required: true, message: '请搜索并选择分销商' }],
        })(
          <Select
            showSearch
            placeholder="输入分销商进行搜索"
            style={{ width: '100%' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={onSearch}
            optionLabelProp="children"
          >
            {franchiserOptions}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ norder, loading, user }) => ({
  norder,
  user,
  loading: loading.effects['norder/get'],
  billLoading: loading.effects['bill/pureFind'],
}))
export default class NormalOrderDetail extends Component {
  state = {
    bills: [],
    finalBills: [],
    logs: [],
    suppliers: [],
    franchisers: [],
    showPrint: false,
    showFranchiserPrint: false,
    callbackCancelrule: '',
    callbackRemark: '',
    showCallbackPreprint: false,
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
    uploading: false,
    supplierModalVisible: false,
    franchiserModalVisible: false,
    currentOrder: {},
    receiptQrcode: '',
    showReceiptQrcode: false,
  };

  componentDidMount = () => {
    this.loadData();
    this.handleFindSupplier('');
    this.handleFindFranchiser('');
  };

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (location.search !== this.props.location.search) {
      this.setState(
        {
          query: parse(location.search, { ignoreQueryPrefix: true }),
          showPrint: false,
          showFranchiserPrint: false,
          callbackCancelrule: '',
          callbackRemark: '',
          showCallbackPreprint: false,
        },
        this.loadData
      );
    }
  }

  loadData = () => {
    const { dispatch } = this.props;
    const { query } = this.state;
    dispatch({
      type: 'norder/get',
      payload: {
        i: query.order_i,
      },
      callback: data => {
        this.setState({
          currentOrder: { ...data },
        });
      },
    });
    dispatch({
      type: 'bill/pureFind',
      payload: {
        order_i: query.order_i,
        order_type: 'ITEM',
        currentPage: 1,
        pageSize: 500,
      },
      callback: bills => {
        this.setState({
          ...bills,
        });
      },
    });
    dispatch({
      type: 'log/find',
      payload: {
        order_i: query.order_i,
        currentPage: 1,
        pageSize: 99,
      },
      callback: data => {
        this.setState({
          logs: data.list,
        });
      },
    });
  };

  handleCallbackPreprintVisiable = flag => {
    this.setState({
      showCallbackPreprint: !!flag,
    });
  };

  handlePrintVisiable = flag => {
    this.setState({
      showPrint: !!flag,
    });
  };

  handlePrintFranchiserVisiable = flag => {
    this.setState({
      showFranchiserPrint: !!flag,
    });
  };

  handlePrintCallback = values => {
    this.setState({
      ...values,
      showCallbackPreprint: false,
      showFranchiserPrint: true,
    });
  };

  handleOnUploadChange = info => {
    if (info.file.status !== 'uploading') {
      this.setState({
        uploading: true,
      });
    }
    if (info.file.status === 'done') {
      const { response } = info.file;
      const { dispatch } = this.props;
      const { currentOrder } = this.state;
      if (response[0] === 0) {
        dispatch({
          type: 'norder/importVistors',
          payload: {
            i: currentOrder.i,
            visitors: JSON.stringify(response[1]),
          },
          callback: () => {
            this.setState({
              uploading: false,
            });
            message.success('导入成功');
          },
        });
      } else {
        message.error(response[1]);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 导入失败，请稍后在试`);
      this.setState({
        uploading: false,
      });
    }
  };

  handleSupplierModalVisible = flag => {
    this.setState({
      supplierModalVisible: !!flag,
    });
  };

  handleChangeSupplier = fieldsValue => {
    const { query } = this.state;
    const { dispatch } = this.props;
    this.props.dispatch({
      type: 'norder/edit',
      payload: {
        i: query.order_i,
        state: 1,
        ...fieldsValue,
      },
      callback: () => {
        message.success('修改成功');
        dispatch({
          type: 'norder/get',
          payload: {
            i: query.order_i,
          },
          callback: data => {
            this.setState({
              currentOrder: { ...data },
            });
          },
        });
        this.setState({
          supplierModalVisible: false,
        });
      },
    });
  };

  handleFindSupplier = (name, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/search',
      payload: {
        currentPage: 1,
        pageSize: 10,
        name: ['like', name],
        i: id,
        limit: '0,10',
      },
      callback: list => {
        this.setState({
          suppliers: list,
        });
      },
    });
  };

  handleFranchiserModalVisible = flag => {
    this.setState({
      franchiserModalVisible: !!flag,
    });
  };

  handleChangeFranchiser = fieldsValue => {
    const { query } = this.state;
    const { dispatch } = this.props;
    this.props.dispatch({
      type: 'norder/edit',
      payload: {
        i: query.order_i,
        ...fieldsValue,
      },
      callback: () => {
        message.success('修改成功');
        dispatch({
          type: 'norder/get',
          payload: {
            i: query.order_i,
          },
          callback: data => {
            this.setState({
              currentOrder: { ...data },
            });
          },
        });
        this.setState({
          franchiserModalVisible: false,
        });
      },
    });
  };

  handleFindFranchiser = (name, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'norder/searchFranchiser',
      payload: {
        currentPage: 1,
        pageSize: 10,
        name: ['like', name],
        i: id,
        limit: '0,10',
      },
      callback: list => {
        this.setState({
          franchisers: list,
        });
      },
    });
  };

  handleCopy = () => {
    const { dispatch } = this.props;
    const { currentOrder } = this.state;
    const newOrder = { ...currentOrder };
    delete newOrder.i;
    dispatch({
      type: 'norder/copyOrder',
      payload: newOrder,
    });
  };

  handleGetReceiptQrcode = () => {
    const { dispatch } = this.props;
    const {
      currentOrder: { i },
    } = this.state;
    dispatch({
      type: 'norder/receiptQrcode',
      payload: { i },
      callback: data => {
        this.setState({
          receiptQrcode: data,
          showReceiptQrcode: true,
        });
      },
    });
  };

  handleReceiptModalVisible = flag => {
    this.setState({
      showReceiptQrcode: !!flag,
    });
  };

  renderFranchiser = record => {
    if (record.salesman_i) {
      return (
        <Description term="分销">{`${record.salesman_name}(${record.salesman_i})`}</Description>
      );
    }
    if (record.franchiser_i) {
      return (
        <Description term="分销">{`${record.franchiser_name}(${record.franchiser_i})`}</Description>
      );
    }
    return null;
  };

  renderAction = currentOrder => (
    <Menu>
      {currentOrder.source === 'ONLINE' ? (
        ''
      ) : (
        <Menu.Item>
          <a onClick={() => this.handleFranchiserModalVisible(true)}>改分销商</a>
        </Menu.Item>
      )}
      <Menu.Item>
        <a onClick={() => this.handleSupplierModalVisible(true)}>改供应商</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleCallbackPreprintVisiable(true)}>分销回执</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handlePrintVisiable(true)}>打印</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleCopy()}>复制</a>
      </Menu.Item>
    </Menu>
  );

  renderFinace = (order, type) => {
    if (!order.i) {
      return <div />;
    }
    return (
      <div className={styles.billCountContainer}>
        <span className={styles.billCountWrap}>
          应收：
          <span className={styles.billCountValue}>{order.actual_amount / 100}</span>
        </span>
        <span className={styles.billCountWrap}>
          应付：
          <span className={styles.billCountValue}>{order.actual_cost / 100}</span>
        </span>
        <span className={styles.billCountWrap}>
          已收：
          <span className={styles.billCountValue}>{order.paid_amount / 100}</span>
        </span>
        <span className={styles.billCountWrap}>
          已付：
          <span className={styles.billCountValue}>{order.paid_cost / 100}</span>
        </span>
        <span className={styles.billCountWrap}>
          已退：
          <span className={styles.billCountValue}>{order.paid_refund / 100}</span>
        </span>
        <span className={styles.billCountWrap}>
          已报销：
          <span className={styles.billCountValue}>{order.paid_expense / 100}</span>
        </span>
        {type === 'finish' ? (
          <span>
            <span className={styles.billCountWrap}>
              理论利润：
              <span className={styles.billCountValue}>
                {(order.actual_amount - order.actual_cost) / 100}
              </span>
            </span>
            <span className={styles.billCountWrap}>
              当前利润：
              <span className={styles.billCountValue}>
                {(order.paid_amount - order.paid_cost - order.paid_expense - order.paid_expense) /
                  100}
              </span>
            </span>
          </span>
        ) : (
          <span>
            <span className={styles.billCountWrap}>
              已借款：
              <span className={styles.billCountValue}>{order.paid_borrow / 100}</span>
            </span>
            <span className={styles.billCountWrap}>
              <span>已收票：</span>
              <span className={styles.billCountValue}>{order.paid_supplier_invoice / 100}</span>
            </span>
            <span className={styles.billCountWrap}>
              <span>已开票：</span>
              <span className={styles.billCountValue}>{order.paid_merchant_invoice / 100}</span>
            </span>
            <span className={styles.billCountWrap}>
              实际利润：
              <span className={styles.billCountValue}>{order.profit / 100}</span>
            </span>
          </span>
        )}
      </div>
    );
  };

  render() {
    const {
      billLoading,
      user: { currentUser },
      loading,
    } = this.props;
    const {
      currentOrder,
      bills,
      finalBills,
      showPrint,
      showFranchiserPrint,
      callbackCancelrule,
      callbackRemark,
      showCallbackPreprint,
      uploading,
      logs,
      suppliers,
      supplierModalVisible,
      franchisers,
      franchiserModalVisible,
      receiptQrcode,
      showReceiptQrcode,
    } = this.state;
    const uploadProps = {
      name: 'file',
      action: '/db/v2/merchant/import_visitors',
      accept: 'application/vnd.ms-excel',
      onChange: this.handleOnUploadChange,
      showUploadList: false,
    };
    const Action = (
      <Fragment>
        {currentOrder.pay_way === 'WXPAY' && currentOrder.state === 'WAIT' ? (
          <Button
            onClick={this.handleGetReceiptQrcode}
            style={{ marginRight: 8 }}
            loading={loading}
          >
            收款二维码
          </Button>
        ) : (
          ''
        )}
        <Dropdown overlay={this.renderAction(currentOrder)} placement="bottomCenter">
          <Button className="ant-dropdown-link">
            操作
            <Icon type="down" />
          </Button>
        </Dropdown>
        <Button onClick={() => this.loadData()} style={{ marginLeft: 8 }} loading={loading}>
          刷新
        </Button>
      </Fragment>
    );
    const newWindowProps = {
      title: currentOrder.order_no,
      center: 'screen',
      features: {
        width: 1200,
        height: 900,
      },
      print: true,
      onUnload: () => this.handlePrintVisiable(false),
    };
    const newFranchiserWindowProps = {
      title: currentOrder.order_no,
      center: 'screen',
      features: {
        width: 1200,
        height: 900,
      },
      print: true,
      onUnload: () => this.handlePrintFranchiserVisiable(false),
    };
    const CallbackPreprintProps = {
      modalVisible: showCallbackPreprint,
      handleModalVisible: this.handleCallbackPreprintVisiable,
      onSubmit: this.handlePrintCallback,
    };
    const supplerPorps = {
      handleModalVisible: this.handleSupplierModalVisible,
      suppliers,
      modalVisible: supplierModalVisible,
      onSubmit: this.handleChangeSupplier,
      onSearch: this.handleFindSupplier,
    };
    const franchiserPorps = {
      handleModalVisible: this.handleFranchiserModalVisible,
      franchisers,
      modalVisible: franchiserModalVisible,
      onSubmit: this.handleChangeFranchiser,
      onSearch: this.handleFindFranchiser,
    };
    return (
      <PageHeaderLayout>
        <Card title={currentOrder.order_no} extra={Action}>
          <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }} col={4}>
            <Description term="下单时间">
              {currentOrder.create_time && currentOrder.create_time.substring(0, 19)}
            </Description>
            <Description term="订单号">{currentOrder.order_no}</Description>
            <Description term="支付方式">{payWay[currentOrder.pay_way]}</Description>
            <Description term="状态">{status[currentOrder.state]}</Description>
            <Description term="订单类型">{sources[currentOrder.source]}</Description>
            {currentOrder.team_no ? (
              <Description term="关联单号">{currentOrder.team_no}</Description>
            ) : null}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="产品信息" style={{ marginBottom: 15 }} col={1}>
            <Description term="产品名称">
              <Ellipsis lines={1} tooltip>
                {currentOrder.item_name}
              </Ellipsis>
            </Description>
            <Description term="商城标题">
              <Ellipsis lines={1} tooltip>
                {currentOrder.item_title}
              </Ellipsis>
            </Description>
            <Description term="套餐">
              <Ellipsis lines={1} tooltip>
                {currentOrder.package && currentOrder.package.name}
              </Ellipsis>
            </Description>
            <Description term="床型/包含">
              {currentOrder.package
                ? `${currentOrder.package.room} / ${currentOrder.package.content}`
                : ''}
            </Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 32 }} col={4}>
            <Description term="酒店名称">
              <Ellipsis lines={1} tooltip>
                {currentOrder.hotel_name}
              </Ellipsis>
            </Description>
            <Description term="产品人">{currentOrder.product_person_name}</Description>
            <Description term="供应商">{currentOrder.supplier_name}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }} col={4}>
            <Description term="用户姓名">{currentOrder.contacts}</Description>
            <Description term="联系电话">{currentOrder.contacts_mobile}</Description>
            <Description term="备注">{currentOrder.remarks || '无'}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="金额信息" style={{ marginBottom: 32 }} col={4}>
            <Description term="单价">
              {currentOrder.item_price && currentOrder.item_price / 100}
            </Description>
            <Description term="数量">{currentOrder.item_num}</Description>
            <Description term="金额">
              {currentOrder.amount && currentOrder.amount / 100}
            </Description>
            <Description term="佣金">
              {currentOrder.commission && currentOrder.commission / 100}
            </Description>
            {this.renderFranchiser(currentOrder)}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>附加项目</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            rowKey="key"
            dataSource={currentOrder.additional || []}
            columns={additionalColumns}
          />
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="内部备注" style={{ marginBottom: 32 }} col={1}>
            {currentOrder.message && currentOrder.message.length > 0 ? (
              currentOrder.message.map(val => (
                <Description term={val.time.substring(5, 16)} key={val.time}>
                  {val.message}
                </Description>
              ))
            ) : (
              <Description term="">无</Description>
            )}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="操作备注" style={{ marginBottom: 32 }} col={1}>
            {!currentOrder.supplier_remarks &&
            !currentOrder.finish_remarks &&
            !currentOrder.cancel_remarks &&
            !currentOrder.merchant_remarks &&
            !currentOrder.change_remarks ? (
              <Description term="">无</Description>
            ) : (
              ''
            )}
            {currentOrder.merchant_remarks ? (
              <Description term="发单备注">{currentOrder.merchant_remarks}</Description>
            ) : (
              ''
            )}
            {currentOrder.supplier_remarks ? (
              <Description term="供应商备注">{currentOrder.supplier_remarks}</Description>
            ) : (
              ''
            )}
            {currentOrder.finish_remarks ? (
              <Description term="完成备注">{currentOrder.finish_remarks}</Description>
            ) : (
              ''
            )}
            {currentOrder.cancel_remarks ? (
              <Description term="拒绝备注">{currentOrder.cancel_remark}</Description>
            ) : (
              ''
            )}
            {currentOrder.change_remarks ? (
              <Description term="改期备注">{currentOrder.change_remarks}</Description>
            ) : (
              ''
            )}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="全部账单记录" key="1">
              {this.renderFinace(currentOrder, 'normal')}
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                loading={billLoading}
                rowKey="i"
                dataSource={bills}
                columns={billColums}
              />
            </TabPane>
            <TabPane tab="结算账单记录" key="2">
              {this.renderFinace(currentOrder, 'finish')}
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                loading={billLoading}
                rowKey="i"
                dataSource={finalBills}
                columns={billColums}
              />
            </TabPane>
          </Tabs>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>每日费用详情</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            rowKey="date"
            dataSource={currentOrder.skus || []}
            columns={currentOrder.item_texture === 'GROUP' ? groupSkusColumns : skusColumns}
          />
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>操作日志</div>
          <Table
            style={{ marginBottom: 16 }}
            loading={billLoading}
            rowKey="i"
            dataSource={logs}
            columns={logColumns}
          />
          {currentOrder.item_texture === 'GROUP' ? (
            <Fragment>
              <Divider style={{ marginBottom: 32 }} />
              <div className={styles.title}>
                团员信息
                <div className={styles.action}>
                  <Upload {...uploadProps}>
                    <Button type="primary" ghost loading={uploading}>
                      <Icon type="upload" /> 导入团员信息
                    </Button>
                  </Upload>
                  <Button
                    href="http://otmj4apgs.bkt.clouddn.com/%E8%B7%9F%E5%9B%A2%E6%B8%B8%E6%88%90%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls"
                    type="default"
                    style={{ marginLeft: 8 }}
                  >
                    下载模板文件
                  </Button>
                </div>
              </div>
              <Table
                style={{ marginBottom: 24 }}
                rowKey="name"
                dataSource={currentOrder.visitors || []}
                columns={visitorColumns}
              />
            </Fragment>
          ) : (
            ''
          )}
          <ChangeSupplierForm {...supplerPorps} />
          <ChangeFranchiserForm {...franchiserPorps} />
          <CallbackPreprint {...CallbackPreprintProps} />
          {showPrint ? (
            <NewWindow {...newWindowProps}>
              <PrintTable detail={currentOrder} user={currentUser} type="normal" />
            </NewWindow>
          ) : (
            ''
          )}
          {showFranchiserPrint ? (
            <NewWindow {...newFranchiserWindowProps}>
              <FranchiserCallback
                detail={currentOrder}
                user={currentUser}
                type="normal"
                cancelRule={callbackCancelrule}
                remark={callbackRemark}
              />
            </NewWindow>
          ) : (
            ''
          )}
          <Modal
            title="收款二维码"
            visible={showReceiptQrcode}
            onCancel={() => this.handleReceiptModalVisible(false)}
            footer={false}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <QRCode value={receiptQrcode} />
            </div>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
