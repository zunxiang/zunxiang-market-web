import React, { Component } from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Card, List } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ user, loading }) => ({
  mpid: user.currentUser.mpid,
  loading: loading.models.banner,
}))
export default class BasicList extends Component {
  render() {
    const { mpid } = this.props;
    const qrcodeBaseUrl = `https://www.zxtgo.com/production/${mpid}/db/v1/client/miniprogram_qrcode`;
    const indexQurey = stringify({
      scene: stringify({ key: 'value' }),
      page: 'pages/index/main',
      width: 280,
    });
    const salesmanQurey = stringify({
      scene: stringify({ key: 'value' }),
      page: 'pages/salesman/register/main',
      width: 280,
    });
    const listQurey = stringify({
      scene: stringify({ key: 'value' }),
      page: 'pages/list/tabbar/main',
      width: 280,
    });
    const data = [
      { key: '首页', value: indexQurey, path: 'pages/index/main' },
      { key: '分销注册', value: salesmanQurey, path: 'pages/salesman/register/main' },
      { key: '产品列表', value: listQurey, path: 'pages/list/tabbar/main' },
    ];
    return (
      <PageHeaderWrapper>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.key}>
              <Card title={item.key} bodyStyle={{ textAlign: 'center' }} extra={item.path}>
                <img src={`${qrcodeBaseUrl}?${item.value}`} alt={item.key} />
              </Card>
            </List.Item>
          )}
        />
      </PageHeaderWrapper>
    );
  }
}
