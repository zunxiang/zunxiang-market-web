import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Popconfirm, Divider, Modal, Button } from 'antd';
import { routerRedux, Link } from 'dva/router';
import update from 'immutability-helper';
import DragSortingTable from '@/components/DragSortingTable';
import PackageEditForm from './NormalPackageEditForm';

import styles from './style.less';

@connect(({ pack, loading }) => ({
  pack,
  loading: loading.models.pack,
}))
export default class BasicList extends PureComponent {
  state = {
    current: {},
    editModalVisible: false,
  };

  columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (val, record, index) => index + 1,
    },
    {
      title: '套餐名',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: 300,
      render: (val, record, index) => {
        const {
          item: { i, type },
        } = this.props;
        return (
          <Fragment>
            <a onClick={() => this.handleEditEvent(record)}>编辑套餐</a>
            <Divider type="vertical" />
            <Link
              to={{
                pathname: '/product/sku',
                search: `package_i=${record.i}&item_i=${i}&package_name=${record.name}&type=${type}`,
              }}
            >
              日期管理
            </Link>
            <Divider type="vertical" />
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该套餐?"
              onConfirm={() => this.handleDelete(record.i, index)}
              okText="确认"
              cancelText="取消"
            >
              <a style={{ color: '#f5222d' }}>删除</a>
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  goodsColumns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (val, record, index) => index + 1,
    },
    {
      title: '套餐名',
      dataIndex: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: val => val / 100,
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '操作',
      width: 300,
      render: (val, record, index) => (
        <Fragment>
          <a onClick={() => this.handleEditEvent(record)}>编辑套餐</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除该套餐?"
            onConfirm={() => this.handleDelete(record.i, index)}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: '#f5222d' }}>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const {
      dispatch,
      item: { i },
    } = this.props;
    if (i) {
      dispatch({
        type: 'pack/find',
        payload: {
          currentPage: 1,
          pageSize: 99,
          order: 'sort:-num',
          item_i: i,
        },
      });
    } else {
      message.error('缺少产品id');
      dispatch(routerRedux.push('/normal/list'));
    }
  };

  moveRow = (dragIndex, hoverIndex) => {
    const {
      pack: {
        data: { list },
      },
      dispatch,
    } = this.props;
    const dragRow = list[dragIndex];
    const newList = update(list, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    const len = newList.length;
    dispatch({
      type: 'pack/dragSorting',
      payload: { list: newList },
      callback: () => {
        let count = 0;
        newList.forEach((val, index) => {
          dispatch({
            type: 'pack/postSorting',
            payload: {
              i: val.i,
              sort: index,
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

  handleDelete = (i, index) => {
    const {
      pack: {
        data: { list },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'pack/delete',
      payload: { i },
      callback: () => {
        list.splice(index, 1);
        dispatch({
          type: 'pack/dragSorting',
          payload: { list },
          callback: () => {
            message.success('删除成功');
          },
        });
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleEditSuccess = () => {
    this.setState(
      {
        current: {},
      },
      () => {
        this.handleModalVisible();
        this.loadData();
      }
    );
  };

  handleEditCancel = () => {
    this.setState(
      {
        current: {},
      },
      () => {
        this.handleModalVisible();
      }
    );
  };

  handleEditEvent = record => {
    this.setState(
      {
        current: {
          packageId: record.i,
          packageName: record.name,
          room: record.room,
          menuId: record.rich_text_content_i,
          price: record.price,
          fee: record.fee,
          stock: record.stock,
        },
      },
      () => {
        this.handleModalVisible(true);
      }
    );
  };

  render() {
    const {
      pack: {
        data: { list },
      },
      loading,
      dispatch,
      item: { i, type },
    } = this.props;
    const { editModalVisible, current } = this.state;
    const editFormProps = {
      itemId: i,
      loading,
      dispatch,
      type,
      ...current,
      successCallback: this.handleEditSuccess,
      cancelCallback: this.handleEditCancel,
    };
    const packList = list.map(p => ({
      ...p,
      fee: p.fee ? JSON.parse(p.fee) : [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    }));
    return (
      <Card
        className={styles.listCard}
        bordered={false}
        title="套餐列表"
        style={{ marginTop: 24 }}
        bodyStyle={{ padding: '0 0 40px 0' }}
      >
        <Button
          type="primary"
          ghost
          style={{ width: '100%', margin: '16px 0' }}
          icon="plus"
          onClick={() => this.handleModalVisible(true)}
        >
          添加
        </Button>
        <DragSortingTable
          dataSource={packList}
          columns={type === 'GOODS' ? this.goodsColumns : this.columns}
          moveRow={this.moveRow}
          rowKey="i"
          pagination={false}
        />
        <Modal
          title="编辑套餐"
          visible={editModalVisible}
          footer={null}
          maskClosable={false}
          onCancel={this.handleEditCancel}
          width={800}
          destroyOnClose
        >
          <PackageEditForm {...editFormProps} />
        </Modal>
      </Card>
    );
  }
}
