import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Calendar, Drawer, Button, Spin, Dropdown, Menu } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SkuForm from './Edit';
import styles from './Sku.less';

@connect(({ loading }) => ({
  loading: loading.models.pack,
}))
export default class SkuManager extends PureComponent {
  constructor(props) {
    super();
    const {
      location: { search },
    } = props;
    const query = parse(search, { ignoreQueryPrefix: true });
    const now = moment();
    this.state = {
      showDrawer: false,
      model: 'range',
      itemType: query.type,
      packId: query.package_i,
      selectedDate: '',
      skuMap: {},
      selectedSKu: {},
      calendarValue: now,
      today: now.format('YYYY-MM-DD'),
      settings: ['price', 'stock', 'lag', 'fee'],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { dispatch } = this.props;
    const { calendarValue, packId } = this.state;
    dispatch({
      type: 'pack/findSku',
      payload: {
        package_i: packId,
        currentPage: 1,
        pageSize: 31,
        order: 'date:+',
        'date@min': calendarValue.startOf('month').format('YYYY-MM-DD 00:00:00'),
        'date@max': calendarValue.endOf('month').format('YYYY-MM-DD 00:00:00'),
      },
      callback: res => {
        const { skuMap } = this.state;
        const temp = {};
        res.forEach(sku => {
          if (!(sku.price <= 0 && sku.stock <= 0)) {
            const [fee1, fee2] = JSON.parse(sku.fee);
            const feeP = fee1.map(fee => fee / 100);
            const feeT = fee2.map(fee => fee / 100);
            temp[sku.date.substring(0, 10)] = {
              ...sku,
              price: sku.price / 100,
              child_price: sku.child_price / 100,
              feeP,
              feeT,
            };
          } else {
            temp[sku.date.substring(0, 10)] = null;
          }
        });
        this.setState({
          skuMap: {
            ...skuMap,
            ...temp,
          },
        });
      },
    });
  };

  handleDrawerVisiable = flag => {
    this.setState({
      showDrawer: !!flag,
    });
  };

  handleSetSingle = date => {
    const { skuMap } = this.state;
    const key = date.format('YYYY-MM-DD');
    this.setState(
      {
        model: 'single',
        selectedDate: date,
        selectedSKu: skuMap[key] || {},
        settings: ['price', 'stock', 'lag', 'fee'],
      },
      () => {
        this.handleDrawerVisiable(true);
      }
    );
  };

  handleSetRange = type => {
    const settings = type ? [type] : ['price', 'stock', 'lag', 'fee'];
    this.setState(
      {
        model: 'range',
        selectedDate: null,
        selectedSKu: {},
        settings,
      },
      () => {
        this.handleDrawerVisiable(true);
      }
    );
  };

  handleOnCalendarChange = date => {
    const { calendarValue } = this.state;
    const isSameMonth = date.isSame(calendarValue, 'month');
    this.setState(
      {
        calendarValue: date,
      },
      () => {
        if (!isSameMonth) {
          this.loadData();
        }
      }
    );
  };

  handleDisableDate = date => {
    const { today } = this.state;
    return date.isBefore(today, 'day');
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    const { packId } = this.state;
    dispatch({
      type: 'pack/skusPost',
      payload: {
        ...values,
        package_i: packId,
      },
      callback: () => {
        this.loadData();
        this.handleDrawerVisiable(false);
      },
    });
  };

  handleCloseSku = date => {
    const { itemType } = this.state;
    const f = date.format('YYYY-MM-DD');
    const values = {
      start_date: f,
      end_date: f,
      weekday: ['0', '1', '2', '3', '4', '5', '6'],
      stock: 0,
      price: 0,
      lag: 0,
      fee: '[[0,0,0,0,0],[0,0,0,0,0]]',
    };
    if (itemType === 'GROUP') {
      values.child_price = 0;
    }
    this.handleSubmit(values);
  };

  handleChangeMonth = month => {
    const { calendarValue } = this.state;
    const date = moment(calendarValue).add(month, 'month');
    this.setState(
      {
        calendarValue: date,
      },
      () => {
        this.loadData();
      }
    );
  };

  renderCell = date => {
    const { skuMap, itemType } = this.state;
    const isDisable = this.handleDisableDate(date);
    const key = date.format('YYYY-MM-DD');
    const sku = skuMap[key];
    return (
      <div className={styles.cellWrap}>
        {!isDisable && (
          <div className={styles.btnWrap}>
            <a onClick={() => this.handleSetSingle(date)}>设置</a>
            {sku && <a onClick={() => this.handleCloseSku(date)}>清空</a>}
          </div>
        )}
        {sku && (
          <div className={styles.dailyInfo}>
            <div className={styles.baseWrap}>
              {itemType === 'GROUP' ? (
                <div className={styles.halfWrap}>
                  <span>成人：{sku.price}</span>
                  <span>儿童：{sku.child_price}</span>
                </div>
              ) : (
                <div className={styles.halfWrap}>
                  <span>价格：{sku.price}</span>
                </div>
              )}
              <div className={styles.halfWrap}>
                <span>库存：{sku.stock}</span>
                <span>提前：{sku.lag}天</span>
              </div>
            </div>
            <div className={styles.feeWrap}>
              <div className={styles.fullWrap}>
                <span>店返：</span>
                <span>{sku.feeP.join(',')}</span>
              </div>
              <div className={styles.fullWrap}>
                <span>团返：</span>
                <span>{sku.feeT.join(',')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  renderMenu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => this.handleSetRange(null)}>设置全部</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleSetRange('price')}>设置价格</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleSetRange('fee')}>设置佣金</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleSetRange('stock')}>设置库存</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleSetRange('lag')}>设置提前天数</a>
      </Menu.Item>
    </Menu>
  );

  render() {
    const { loading } = this.props;
    const {
      showDrawer,
      model,
      itemType,
      selectedDate,
      selectedSKu,
      calendarValue,
      settings,
    } = this.state;
    const formProps = {
      model,
      itemType,
      selectedDate,
      selectedSKu,
      onSubmit: this.handleSubmit,
      disabledDate: this.handleDisableDate,
      settings,
    };
    return (
      <PageHeaderWrapper>
        <Card>
          <Spin spinning={loading}>
            <div className={styles.calendarWrap}>
              <div className={styles.operationBtnWrap}>
                <Dropdown overlay={this.renderMenu}>
                  <Button type="default">区间设置</Button>
                </Dropdown>
              </div>
              <div className={styles.prevMonthBtn}>
                <Button type="default" onClick={() => this.handleChangeMonth(-1)}>
                  上一月
                </Button>
              </div>
              <div className={styles.nextMonthBtn}>
                <Button type="default" onClick={() => this.handleChangeMonth(1)}>
                  下一月
                </Button>
              </div>
              <Calendar
                dateCellRender={this.renderCell}
                onChange={this.handleOnCalendarChange}
                disabledDate={this.handleDisableDate}
                value={calendarValue}
              />
            </div>
          </Spin>
        </Card>
        <Drawer
          title="信息设置"
          width={550}
          closable
          placement="right"
          onClose={() => this.handleDrawerVisiable(false)}
          visible={showDrawer}
          destroyOnClose
        >
          <SkuForm {...formProps} />
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}
