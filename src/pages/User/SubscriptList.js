import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Card, Row, Col, message, Button, Avatar, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import QRCode from 'qrcode-react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import './SubscriptList.less';

@connect(({ normal, user, loading }) => ({
  normal,
  user,
  loading: loading.models.user,
}))
export default class BasicList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 99,
    data: {
      list: [],
      pagination: {},
    },
  };

  componentDidMount() {
    const {
      user: {
        currentUser: { wxopenid },
      },
    } = this.props;
    if (wxopenid) {
      this.loadData();
    }
  }

  loadData = () => {
    const {
      dispatch,
      user: {
        currentUser: { userid },
      },
    } = this.props;
    const { pageSize, currentPage } = this.state;
    const params = {
      currentPage,
      pageSize,
      'notice_accounts@like': `${userid}`,
    };
    dispatch({
      type: 'user/findSubscript',
      payload: params,
      callback: data => {
        this.setState({
          data: { ...data },
        });
      },
    });
  };

  handlerDelete = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notify/dissubscript',
      payload: { i },
      callback: () => {
        message.success('删除成功');
        this.loadData();
      },
    });
  };

  handleGetInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchInfo',
      payload: {},
      callback: user => {
        if (user.wxopenid) {
          this.loadData();
        } else {
          message.error('无订阅记录');
        }
      },
    });
  };

  handleUnsubscript = i => {
    const { dispatch } = this.props;
    dispatch({
      type: `user/unsubscript`,
      payload: { i },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  render() {
    const {
      loading,
      user: { currentUser },
    } = this.props;
    const {
      data: { list, pagination },
    } = this.state;
    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      size: 'small',
      showTotal: total => (
        <span>
          共 <span style={{ color: '#1890ff' }}>{total}</span> 条数据
        </span>
      ),
      ...pagination,
    };

    return (
      <PageHeaderWrapper>
        <Row type="flex" justify="center" gutter={32}>
          <Col sm={24} xs={24}>
            <Card
              bordered={false}
              title="订阅列表"
              extra={currentUser.wxopenid ? <Avatar size="large" src={currentUser.avatar} /> : null}
            >
              {currentUser.wxopenid ? (
                <List
                  size="large"
                  rowKey="id"
                  loading={loading}
                  pagination={paginationProps}
                  dataSource={list}
                  bordered
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Popconfirm
                          title="确认取消订阅该产品?"
                          onConfirm={() => this.handleUnsubscript(item.i)}
                          okText="确认"
                          cancelText="取消"
                        >
                          <a>取消订阅</a>
                        </Popconfirm>,
                      ]}
                    >
                      <Link to={`/product/normal/detail?i=${item.i}`}>{item.title}</Link>
                    </List.Item>
                  )}
                />
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <h4>请使用需要绑定的微信号扫描下方二维码绑定</h4>
                  <div style={{ margin: '0 auto' }}>
                    <QRCode
                      value={`http://${location.host}/m/subscript.html?bind_i=${
                        currentUser.userid
                      }`}
                    />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Button type="primary" ghost onClick={this.handleGetInfo}>
                      我已绑定
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}
