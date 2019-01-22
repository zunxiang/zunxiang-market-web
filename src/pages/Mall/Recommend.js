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
      list: [],
      recommends: [],
      searching: false,
      selected: undefined,
    };
    this.columns = [
      {
        title: '产品图片',
        dataIndex: 'images',
        render: val => <img src={BaseImgUrl + val[0]} alt="产品图片" style={{ width: 100 }} />,
      },
      {
        title: '产品标题',
        dataIndex: 'title',
      },
      {
        title: '状态',
        dataIndex: 'state',
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
      type: 'recommend/get',
      payload: {},
      callback: list => {
        this.setState(
          {
            list: [...list],
          },
          () => {
            this.loadRecommends();
          }
        );
      },
    });
  };

  loadRecommends = () => {
    const { dispatch } = this.props;
    const { list } = this.state;
    dispatch({
      type: 'recommend/findProduct',
      payload: {
        currentPage: 1,
        pageSize: 999,
        'i@in': list,
      },
      callback: data => {
        const items = data.list.map(item => ({
          ...item,
          images: item.images ? item.images.split(',') : '',
        }));
        const sorted = list.map(id => items.filter(item => item.i === id)[0]);
        this.setState({
          recommends: sorted,
        });
      },
    });
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { dispatch } = this.props;
    const { recommends } = this.state;
    const dragRow = recommends[dragIndex];
    const newRecommends = update(recommends, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });
    const newList = newRecommends.map(val => val.i);
    dispatch({
      type: 'recommend/set',
      payload: { list: newList },
      callback: () => {
        this.setState({
          list: [...newList],
          recommends: [...newRecommends],
        });
        message.success('排序成功');
      },
    });
  };

  handleAdd = () => {
    const { dispatch } = this.props;
    const { selected, list } = this.state;
    if (!selected) {
      message.error('请先选择需要推荐的产品');
      return;
    }
    if (list.includes(selected)) {
      message.error('你已经推荐过该产品了');
      return;
    }
    dispatch({
      type: 'recommend/set',
      payload: {
        list: [...list, selected],
      },
      callback: () => {
        this.setState(
          {
            selected: undefined,
            list: [...list, selected],
          },
          () => {
            this.loadRecommends();
            message.success('推荐成功');
          }
        );
      },
    });
  };

  handleDelete = i => {
    const { dispatch } = this.props;
    const { recommends } = this.state;
    const newRecommneds = recommends.filter(val => i !== val.i);
    const newList = newRecommneds.map(val => val.i);
    dispatch({
      type: 'recommend/set',
      payload: {
        list: newList,
      },
      callback: () => {
        this.setState({
          list: newList,
          recommends: [...newRecommneds],
        });
        message.success('取消成功');
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
          type: 'recommend/findProduct',
          payload: {
            currentPage: 1,
            pageSize: 10,
            'title@like': name,
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
    const { loading } = this.props;
    const { items, searching, selected, recommends } = this.state;
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
                      {d.title}
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
              dataSource={recommends}
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
