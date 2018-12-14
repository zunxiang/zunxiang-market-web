import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon } from 'antd';
import generteItems from './generateItems';
import getParse from './parse';

import styles from './style.less';

@Form.create()
export default class SearchForm extends Component {
  state = {
    expandForm: false,
  };

  componentDidMount = () => {
    const { onMounted } = this.props;
    if (onMounted) onMounted(this);
  };

  onSubmit = e => {
    e.preventDefault();

    const { form, items, onSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {};
      for (const key in fieldsValue) {
        if (fieldsValue[key]) {
          const [item] = items.filter(val => val.key === key);
          const parse = getParse(item.parse);
          if (item.parse === 'dateRangeArray') {
            const arr = parse(fieldsValue[key]);
            if (arr) {
              const [start, end] = arr;
              values[`${key}@min`] = start;
              values[`${key}@max`] = end;
            }
          } else {
            values[key] = parse(fieldsValue[key]);
          }
        }
      }
      onSubmit(values);
    });
  };

  getFormValue = callback => {
    const { form, items } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {};
      for (const key in fieldsValue) {
        if (fieldsValue[key]) {
          const [item] = items.filter(val => val.key === key);
          const parse = getParse(item.parse);
          values[key] = parse(fieldsValue[key]);
        }
      }
      callback(values);
    });
  };

  handleFormReset = () => {
    const { form, onSubmit } = this.props;
    form.resetFields();
    onSubmit({});
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  render() {
    const { items, values, extra, form, onRefresh } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    const itemProps = {
      items: expandForm ? items : items.slice(0, 5),
      values,
      getFieldDecorator,
      layout: {},
    };

    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.onSubmit} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="start">
            {generteItems(itemProps).map(Item => (
              <Col md={8} sm={24} key={Item.key}>
                {Item}
              </Col>
            ))}
            {expandForm ? null : (
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                  {onRefresh ? (
                    <Button icon="reload" style={{ marginLeft: 8 }} onClick={onRefresh} />
                  ) : null}
                  <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                    展开
                    <Icon type="down" />
                  </a>
                </span>
              </Col>
            )}
          </Row>
          {expandForm ? (
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 16 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                {extra}
                {onRefresh ? (
                  <Button icon="reload" style={{ marginLeft: 8 }} onClick={onRefresh} />
                ) : null}
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>
              </span>
            </div>
          ) : null}
        </Form>
      </div>
    );
  }
}
