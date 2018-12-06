import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Popconfirm, Input, Badge } from 'antd';
import update from 'immutability-helper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragSortingTable from '@/components/DragSortingTable';
import { BaseImgUrl } from '../../common/config';
import styles from './Style.less';

const { Search } = Input;
const statusMap = {
  0: 'default',
  1: 'processing',
  2: 'warning',
};
const status = {
  0: '已下架',
  1: '出售中',
  2: '已售罄',
};

@connect(({ recommend, loading }) => ({
  recommend,
  loading: loading.models.recommend,
}))
export default class BasicList extends PureComponent {
  state = {};
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recommend/find',
      payload: {
        currentPage: 1,
        pageSize: 99,
        order: 'sort:-num',
      },
    });
  };

  moveRow = (dragIndex, hoverIndex) => {
    const {
      recommend: {
        data: { list },
      },
      dispatch,
    } = this.props;
    const dragRow = list[dragIndex];
    const newList = update(list, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    dispatch({
      type: 'recommend/dragSorting',
      payload: { list: newList },
      callback: () => {
        dispatch({
          type: 'recommend/postSorting',
          payload: newList.map((val, index) => {
            return {
              i: val.i,
              sort: index + 1,
            };
          }),
          callback: () => {
            message.success('排序成功');
          },
        });
      },
    });
  };

  handleAdd = ids => {
    const {
      dispatch,
      recommend: {
        data: { list },
      },
    } = this.props;
    const params = ids.split(',').map((id, index) => {
      return {
        item_i: id,
        sort: list.length + index + 1,
      };
    });
    dispatch({
      type: 'recommend/add',
      payload: params,
      callback: () => {
        this.loadData();
        message.success('添加成功');
      },
    });
  };

  handleDelete = (i, index) => {
    const {
      recommend: {
        data: { list },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'recommend/delete',
      payload: { i },
      callback: () => {
        list.splice(index, 1);
        dispatch({
          type: 'recommend/dragSorting',
          payload: { list },
          callback: () => {
            message.success('取消成功');
          },
        });
      },
    });
  };

  columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      render: (val, record, index) => {
        return index + 1;
      },
    },
    {
      title: '产品图片',
      dataIndex: 'item.images',
      render: val => {
        const imgs = val.split(',');
        return <img src={BaseImgUrl + imgs[0]} alt="产品图片" style={{ width: 100 }} />;
      },
    },
    {
      title: '产品标题',
      dataIndex: 'item.name',
    },
    {
      title: '状态',
      dataIndex: 'item.state',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (val, record, index) => {
        return (
          <Fragment>
            <Popconfirm
              title="确认取消推荐该产品?"
              onConfirm={() => this.handleDelete(record.i, index)}
              okText="确认"
              cancelText="取消"
            >
              <a style={{ color: '#f5222d' }}>取消推荐</a>
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  render() {
    const {
      recommend: {
        data: { list },
      },
    } = this.props;
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="推荐列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={
              <Search
                placeholder="请输入产品id"
                onSearch={value => this.handleAdd(value)}
                enterButton="添加"
              />
            }
          >
            <DragSortingTable
              dataSource={list}
              columns={this.columns}
              moveRow={this.moveRow}
              rowKey="i"
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
