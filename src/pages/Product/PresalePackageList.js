import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Divider, Modal } from 'antd';
import { Link } from 'dva/router';
import update from 'immutability-helper';
import DragSortingTable from '@/components/DragSortingTable';
import PackageEditForm from './PresalePackageEditForm';

import styles from './style.less';

@connect(({ pack, loading }) => ({
  pack,
  loading: loading.models.pack,
}))
export default class BasicList extends PureComponent {
  state = {
    editModalVisible: false,
    currentPackage: {},
  };

  columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      render: (val, record, index) => index + 1,
    },
    {
      title: '套餐名',
      dataIndex: 'name',
    },
    {
      title: '操作',
      render: (val, record) => {
        const { item } = this.props;
        return (
          <Fragment>
            <a onClick={() => this.handleEditEvent(record)}>编辑套餐</a>
            <Divider type="vertical" />
            <Link
              to={{
                pathname: '/presale/pack-manage',
                search: `package_i=${record.i}&rush_i=${item.i}&package_name=${record.name}`,
              }}
            >
              套餐管理
            </Link>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { dispatch, item } = this.props;
    dispatch({
      type: 'pack/find',
      payload: {
        currentPage: 1,
        pageSize: 99,
        order: 'sort:-num',
        rush_i: item.i,
      },
    });
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
        currentPackage: {},
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
        currentPackage: {},
      },
      () => {
        this.handleModalVisible();
      }
    );
  };

  handleEditEvent = record => {
    this.setState(
      {
        currentPackage: {
          packageId: record.i,
          packageName: record.name,
          supplierId: record.supplier_i,
          menu: record.menu,
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
      item,
    } = this.props;
    const { editModalVisible, currentPackage } = this.state;
    const editFormProps = {
      rushId: item.i,
      loading,
      dispatch,
      ...currentPackage,
      successCallback: this.handleEditSuccess,
      cancelCallback: this.handleEditCancel,
    };
    return (
      <Card
        className={styles.listCard}
        bordered={false}
        title="包含套餐"
        style={{ marginTop: 24 }}
        bodyStyle={{ padding: '0 32px 40px 32px' }}
      >
        <DragSortingTable
          dataSource={list}
          columns={this.columns}
          moveRow={this.moveRow}
          rowKey="i"
        />
        <Modal
          title="编辑套餐"
          visible={editModalVisible}
          footer={null}
          maskClosable={false}
          onCancel={this.handleEditCancel}
          width={700}
          destroyOnClose
        >
          <PackageEditForm {...editFormProps} />
        </Modal>
      </Card>
    );
  }
}
