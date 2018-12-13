import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Popconfirm, Button, Badge, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import update from 'immutability-helper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DragSortingTable from '@/components/DragSortingTable';
import { BaseImgUrl } from '../../common/config';
import styles from './Style.less';

const { Option } = Select;
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
export default class Recommend extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      searching: false,
      selected: undefined,
    };
    this.columns = [
      {
        title: '排序',
        dataIndex: 'sort',
        render: (val, record, index) => index + 1,
      },
      {
        title: '产品图片',
        dataIndex: 'item.images',
        render: val => {
          const imgs = val ? val.split(',') : [];
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
        render: (val, record, index) => (
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
        ),
      },
    ];
    this.handleSearchItem = debounce(this.handleSearchItem, 800);
  }

  componentDidMount() {
    this.loadData();
    this.handleSearchItem();
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
          payload: newList.map((val, index) => ({
            i: val.i,
            sort: index + 1,
          })),
          callback: () => {
            message.success('排序成功');
          },
        });
      },
    });
  };

  handleAdd = () => {
    const {
      dispatch,
      recommend: {
        data: { list },
      },
    } = this.props;
    const { selected } = this.state;
    if (!selected) {
      message.error('请先选择需要推荐的产品');
      return;
    }
    const filterList = list.filter(val => val.item_i === selected);
    if (filterList.length > 0) {
      message.error('你已经推荐过该产品了');
      return;
    }
    dispatch({
      type: 'recommend/add',
      payload: [
        {
          item_i: selected,
          sort: list.length + 1,
        },
      ],
      callback: () => {
        this.setState({
          selected: undefined,
        });
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

  handleSearchItem = name => {
    const { dispatch } = this.props;
    this.setState(
      {
        searching: true,
      },
      () => {
        dispatch({
          type: 'normal/find',
          payload: {
            currentPage: 1,
            pageSize: 10,
            'title@like': name,
            is_display: 'TRUE',
          },
          callback: data => {
            this.setState({
              items: [...data.list],
              searching: false,
            });
          },
        });
      }
    );
  };

  handleOnSelectChange = value => {
    this.setState({
      selected: value,
    });
  };

  render() {
    const {
      recommend: {
        data: { list },
      },
      loading,
    } = this.props;
    const { items, searching, selected } = this.state;
    return (
      <PageHeaderWrapper>
        <div className={styles.recommendWrap}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="推荐列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={
              <Fragment>
                <Select
                  placeholder="输入产品关键字搜索并添加"
                  notFoundContent={searching ? <Spin size="small" /> : null}
                  filterOption={false}
                  showSearch
                  value={selected}
                  onSearch={this.handleSearchItem}
                  onChange={this.handleOnSelectChange}
                  showArrow={false}
                  style={{ width: 300 }}
                >
                  {items.map(d => (
                    <Option key={d.i} value={d.i}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
                <Button type="primary" onClick={this.handleAdd} loading={loading}>
                  添加
                </Button>
              </Fragment>
            }
          >
            <DragSortingTable
              dataSource={list}
              columns={this.columns}
              moveRow={this.moveRow}
              rowKey="i"
              pagination={false}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
