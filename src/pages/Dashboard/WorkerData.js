import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, List, Avatar, Row, Col, Statistic, Collapse } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Workplace.less';

const { Panel } = Collapse;

@connect(({ user, loading }) => ({
  user,
  notifyLoading: loading.models.notify,
}))
export default class Workplace extends Component {
  state = {
    notifys: {
      list: [],
      pagination: {},
    },
    productNum: 0,
    orderNum: 0,
    userNum: 0,
    salesmanNum: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'statistics/count',
      payload: {
        name: 'item',
      },
      callback: total => {
        this.setState({
          productNum: total,
        });
      },
    });
    dispatch({
      type: 'statistics/count',
      payload: {
        name: 'order',
      },
      callback: total => {
        this.setState({
          orderNum: total,
        });
      },
    });
    dispatch({
      type: 'statistics/count',
      payload: {
        name: 'user',
      },
      callback: total => {
        this.setState({
          userNum: total,
        });
      },
    });
    dispatch({
      type: 'statistics/count',
      payload: {
        name: 'salesman',
      },
      callback: total => {
        this.setState({
          salesmanNum: total,
        });
      },
    });
    dispatch({
      type: 'notify/find',
      payload: {
        pageSize: 50,
        currentPage: 1,
      },
      callback: data => {
        this.setState({
          notifys: {
            ...data,
          },
        });
      },
    });
  }

  handleGreetings = () => {
    const hour = moment().hour();
    if (hour < 12) {
      return '上午好';
    }
    if (hour >= 12 && hour < 14) {
      return '中午好';
    }
    if (hour >= 14 && hour <= 19) {
      return '下午好';
    }
    return '晚上好';
  };

  renderActivities = () => {
    const {
      notifys: { list },
    } = this.state;
    return list.map(item => <List.Item key={item.id}>{item.title}</List.Item>);
  };

  render() {
    const {
      notifyLoading,
      user: { currentUser },
    } = this.props;
    const {
      productNum,
      orderNum,
      userNum,
      salesmanNum,
      notifys: { list },
    } = this.state;
    const customPanelStyle = {
      background: '#fff',
      borderRadius: 4,
      marginBottom: 0,
      overflow: 'hidden',
    };
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            {`${this.handleGreetings()}，${currentUser.name}`}
            ，祝你开心每一天！
          </div>
          <div>-----------</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>产品数</p>
          <p>{productNum}</p>
        </div>
        <div className={styles.statItem}>
          <p>订单数</p>
          <p>{orderNum}</p>
        </div>
        <div className={styles.statItem}>
          <p>业绩</p>
          <p>---</p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={16}>
          <Col md={6} sm={8} xs={12}>
            <Card>
              <Statistic title="产品数" value={productNum} />
            </Card>
          </Col>
          <Col md={6} sm={8} xs={12}>
            <Card>
              <Statistic title="订单数" value={orderNum} />
            </Card>
          </Col>
          <Col md={6} sm={8} xs={12}>
            <Card>
              <Statistic title="用户数" value={userNum} />
            </Card>
          </Col>
          <Col md={6} sm={8} xs={12}>
            <Card>
              <Statistic title="分销数" value={salesmanNum} />
            </Card>
          </Col>
        </Row>
        <Card
          bodyStyle={{ padding: 0 }}
          style={{ marginTop: 24 }}
          bordered={false}
          title="消息"
          loading={notifyLoading}
        >
          <Collapse accordion bordered={false}>
            {list.map(item => (
              <Panel header={item.title} key={item.i} style={customPanelStyle}>
                {/* eslint-disable */}
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                {/* eslint-disable */}
              </Panel>
            ))}
          </Collapse>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
