import React, { PureComponent, Fragment } from 'react';
import { Form, InputNumber, Row, Col, DatePicker, Checkbox, Button } from 'antd';

import styles from './Sku.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const weekList = ['一', '二', '三', '四', '五', '六', '日'];
const feeLevels = ['一', '二', '三', '四', '五'];
@Form.create()
export default class SkuForm extends PureComponent {
  state = {};

  DateRangeRender = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <Col span={24}>
          <div className={styles.formItem}>
            <FormItem label="日期区间">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '请选择日期区间',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.formItem}>
            <FormItem label="设置星期">
              {getFieldDecorator('week', {
                rules: [
                  {
                    required: true,
                    message: '请选择需要设置的星期日',
                  },
                ],
                initialValue: [0, 1, 2, 3, 4, 5, 6],
              })(
                <CheckboxGroup>
                  {weekList.map((week, index) => (
                    <Checkbox value={index} key={week}>
                      {week}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            </FormItem>
          </div>
        </Col>
      </Fragment>
    );
  };

  DateSingleRender = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Col span={24}>
        <div className={styles.formItem}>
          <FormItem label="日期">
            {getFieldDecorator('date', {
              rules: [
                {
                  required: true,
                  message: '请选择日期',
                },
              ],
            })(<DatePicker style={{ width: '100%' }} />)}
          </FormItem>
        </div>
      </Col>
    );
  };

  SigelPriceRender = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Col span={12}>
        <div className={styles.formItem}>
          <FormItem label="价格">
            {getFieldDecorator('price', {
              rules: [
                {
                  required: true,
                  message: '请输入价格',
                },
              ],
            })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
          </FormItem>
        </div>
      </Col>
    );
  };

  GroupPriceRender = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <Col span={12}>
          <div className={styles.formItem}>
            <FormItem label="成人价">
              {getFieldDecorator('price', {
                rules: [
                  {
                    required: true,
                    message: '请输入成人价格',
                  },
                ],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.formItem}>
            <FormItem label="儿童价">
              {getFieldDecorator('child_price', {
                rules: [
                  {
                    required: true,
                    message: '请输入儿童价格',
                  },
                ],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </div>
        </Col>
      </Fragment>
    );
  };

  render() {
    const { form, model = 'range', itemType = 'GROUP' } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={16}>
          {model === 'range' ? this.DateRangeRender() : this.DateSingleRender()}
          {itemType === 'GROUP' ? this.GroupPriceRender() : this.SigelPriceRender()}
          <Col span={12}>
            <div className={styles.formItem}>
              <FormItem label="库存">
                {getFieldDecorator('inventory', {
                  rules: [
                    {
                      required: true,
                      message: '请输入产品简介',
                    },
                  ],
                })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
              </FormItem>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.formTitle}>佣金计划</div>
          </Col>
          <Col span={12}>
            <div className={styles.subTitle}>店返</div>
            {feeLevels.map((fee, index) => (
              <FormItem label={`${fee}级`} key={`feePerson${fee}`}>
                {getFieldDecorator(`feePerson${index}`, {
                  rules: [
                    {
                      required: true,
                      message: '请输入产品简介',
                    },
                  ],
                })(<InputNumber placeholder="请输入" style={{ width: '80%' }} />)}
              </FormItem>
            ))}
          </Col>
          <Col span={12}>
            <div className={styles.subTitle}>团返</div>
            {feeLevels.map((fee, index) => (
              <FormItem label={`${fee}级`} key={`feeTeam${fee}`}>
                {getFieldDecorator(`feeTeam${index}`, {
                  rules: [
                    {
                      required: true,
                      message: '请输入产品简介',
                    },
                  ],
                })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
              </FormItem>
            ))}
          </Col>
          <Col span={24}>
            <div className={styles.formBtnWrap}>
              <Button type="primary">保存</Button>
              <Button type="default" style={{ marginLeft: 32 }}>
                取消
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
