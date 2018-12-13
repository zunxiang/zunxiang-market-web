import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Tag, Card, Input, Icon, message, Spin } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Style.less';

@connect(({ loading }) => ({
  loading: loading.models.mallSetting,
}))
class TypeSetting extends PureComponent {
  state = {
    types: [
      {
        name: '周边',
        children: [{ name: '广州' }, { name: '河源' }, { name: '从化' }, { name: '韶关' }],
      },
      {
        name: '欧洲',
        children: [{ name: '法国' }, { name: '英国' }, { name: '德国' }],
      },
    ],
    inputVisible: -1,
    inputValue: '',
  };

  handleShowInput = index => {
    this.setState({
      inputVisible: index,
    });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value.trim() });
  };

  handleInputConfirm = index => {
    const { inputValue } = this.state;
    if (inputValue) {
      const { types } = this.state;
      const newTypes = [...types];
      const row = newTypes[index];
      const findList = row.children.filter(val => val.name === inputValue);
      if (findList.length > 0) {
        message.error('该标签已经存在了');
        return;
      }
      const newRow = {
        ...row,
        children: [...row.children, { name: inputValue }],
      };
      newTypes.splice(index, 1, newRow);
      this.setState({
        types: newTypes,
        inputVisible: null,
      });
    } else {
      this.setState({
        inputVisible: -1,
      });
    }
  };

  handleClose = (parent, children) => {
    const { types } = this.state;
    const newTypes = [...types];
    const newChildren = [...newTypes[parent].children];
    newChildren.splice(children, 1);
    const row = {
      ...newTypes[parent],
      children: newChildren,
    };
    newTypes.splice(parent, 1, row);
    this.setState({ types: newTypes });
  };

  render() {
    const { loading = false } = this.props;
    const { types, inputVisible } = this.state;
    return (
      <PageHeaderWrapper>
        <Spin spinning={loading} delay={500}>
          <Card title="推荐标签设置" bodyStyle={{ padding: 0 }}>
            <List
              itemLayout="vertical"
              size="small"
              bordered
              dataSource={types}
              renderItem={(item, index) => (
                <List.Item>
                  <div className={styles.listItemTitle}>{item.name}</div>
                  <div>
                    {item.children.map((child, childIndex) => (
                      <Tag
                        key={child.name}
                        closable
                        className={styles.listTag}
                        afterClose={() => this.handleClose(index, childIndex)}
                      >
                        {child.name}
                      </Tag>
                    ))}
                    {inputVisible === index && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="default"
                        style={{ width: 78 }}
                        onChange={this.handleInputChange}
                        onBlur={() => this.handleInputConfirm(index)}
                        onPressEnter={() => this.handleInputConfirm(index)}
                      />
                    )}
                    {inputVisible !== index && (
                      <Tag
                        onClick={() => this.handleShowInput(index)}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                        className={styles.listTag}
                      >
                        <Icon type="plus" />
                        添加
                      </Tag>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default TypeSetting;
