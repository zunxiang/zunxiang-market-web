import React from 'react';
import { Form, InputNumber, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import { formItemLayout } from './common';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const PresaleInfo = props => {
  const { form, initialValue } = props;
  const { getFieldDecorator } = form;
  return (
    <>
      <div className={styles.tableListForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="start">
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label="预售时间">
              {getFieldDecorator('presaleTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择预售时间',
                  },
                ],
                initialValue:
                  initialValue.model !== 'add'
                    ? [
                        moment(initialValue.presales_begin_time),
                        moment(initialValue.presales_end_time),
                      ]
                    : [],
              })(
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={24} sm={24}>
            <FormItem {...formItemLayout} label="预售数量">
              {getFieldDecorator('stock', {
                rules: [
                  { required: true, message: '请输入预售数量' },
                  { type: 'number', min: 0, message: '预售数量不能小于0' },
                ],
                initialValue: initialValue.stock,
              })(<InputNumber style={{ width: '100%' }} min={0} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={24} sm={24}>
            <FormItem {...formItemLayout} label="售价">
              {getFieldDecorator('price', {
                rules: [
                  { required: true, message: '请输入销售价格' },
                  { type: 'number', min: 0, message: '价格不能小于0' },
                ],
                initialValue: initialValue.price,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/￥\s?|(,*)/g, '')}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PresaleInfo;
