import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, List, Avatar, Row, Col, Statistic } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Workplace.less';

@connect(({ user, loading }) => ({
  user,
  projectLoading: loading.models.user,
}))
export default class Workplace extends Component {
  state = {
    notifyContent: '',
  };

  /* componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notify/get',
      payload: {
        i: 1,
      },
      callback: data => {
        if (data.content) {
          const { content } = data;
          this.setState({
            notifyContent: content,
          });
        }
      },
    });
  } */

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
    const list = [];
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  };

  render() {
    const {
      activitiesLoading,
      user: { currentUser },
    } = this.props;
    const { notifyContent } = this.state;
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
          <p>---</p>
        </div>
        <div className={styles.statItem}>
          <p>新订单</p>
          <p>---</p>
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
              <Statistic title="产品数" value={100} />
            </Card>
          </Col>
          <Col md={6} sm={8} xs={12}>
            <Card>
              <Statistic title="产品数" value={100} />
            </Card>
          </Col>
          <Col md={6} sm={8} xs={12}>
            <Card>
              <Statistic title="产品数" value={100} />
            </Card>
          </Col>
          <Col md={6} sm={8} xs={12}>
            <Card>
              <Statistic title="产品数" value={100} />
            </Card>
          </Col>
        </Row>
        <Card
          bodyStyle={{ padding: 0 }}
          bordered={false}
          className={styles.activeCard}
          title="消息"
          loading={activitiesLoading}
        >
          <List loading={activitiesLoading} size="large">
            <div className={styles.activitiesList}>{this.renderActivities()}</div>
          </List>
          {/* eslint react/no-danger: 0 */}
          <div style={{ padding: 15 }} dangerouslySetInnerHTML={{ __html: notifyContent }} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
