import React, { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Row, Col, DatePicker, Checkbox, Button } from 'antd';
import currency from 'currency.js';

import styles from './Sku.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const weekList = ['日', '一', '二', '三', '四', '五', '六'];
const defaultWeek = ['0', '1', '2', '3', '4', '5', '6'];
const feeLevels = ['一', '二', '三', '四', '五'];

@Form.create()
export default class SkuForm extends PureComponent {
  constructor(props) {
    super(props);
    const {
      selectedSKu: { feeP, feeT },
    } = props;
    this.state = {
      feeP: feeP || [null, null, null, null, null],
      feeT: feeT || [null, null, null, null, null],
    };
  }

  handleFillFee = (type, index) => {
    const { form } = this.props;
    const value = this.state[type][index - 1];
    form.setFieldsValue({ [type + index]: value });
    this.handleFeeChange(value, type, index);
  };

  handleFeeChange = (value, type, index) => {
    const newFee = [...this.state[type]];
    newFee[index] = value;
    this.setState({
      [type]: [...newFee],
    });
  };

  handleOnSave = () => {
    const { form, itemType, model, onSubmit, settings } = this.props;
    form.validateFieldsAndScroll((err, fieldsvalue) => {
      if (err) return;
      const values = {};
      if (model === 'range') {
        const [start, end] = fieldsvalue.date;
        values.start_date = start.format('YYYY-MM-DD');
        values.end_date = end.format('YYYY-MM-DD');
        values.weekday = fieldsvalue.week;
      } else {
        const date = fieldsvalue.date.format('YYYY-MM-DD');
        values.start_date = date;
        values.end_date = date;
        values.weekday = defaultWeek;
      }
      if (settings.includes('stock')) {
        values.stock = fieldsvalue.stock || 0;
      }
      if (settings.includes('lag')) {
        values.lag = fieldsvalue.lag || 0;
      }
      if (settings.includes('price')) {
        values.price = fieldsvalue.price ? currency(fieldsvalue.price).intValue : 0;
        if (itemType === 'GROUP') {
          values.child_price = fieldsvalue.child_price
            ? currency(fieldsvalue.child_price).intValue
            : 0;
        }
      }
      if (settings.includes('fee')) {
        const feeP = [];
        const feeT = [];
        for (let i = 0; i < 5; i += 1) {
          feeP[i] = fieldsvalue[`feeP${i}`] ? currency(fieldsvalue[`feeP${i}`]).intValue : 0;
          feeT[i] = fieldsvalue[`feeT${i}`] ? currency(fieldsvalue[`feeT${i}`]).intValue : 0;
        }
        values.fee = JSON.stringify([feeP, feeT]);
      }
      onSubmit(values);
    });
  };

  renderDateRange = () => {
    const { form, disabledDate } = this.props;
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
              })(<RangePicker disabledDate={disabledDate} style={{ width: '100%' }} />)}
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
                initialValue: defaultWeek,
              })(
                <CheckboxGroup>
                  {weekList.map((week, index) => (
                    <Checkbox value={`${index}`} key={week}>
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

  renderDateSingle = () => {
    const { form, selectedDate, disabledDate } = this.props;
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
              initialValue: selectedDate,
            })(<DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />)}
          </FormItem>
        </div>
      </Col>
    );
  };

  renderSigelPrice = () => {
    const {
      form,
      selectedSKu: { price },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Col span={12}>
        <div className={styles.formItem}>
          <FormItem label="价格">
            {getFieldDecorator('price', {
              rules: [
                {
                  required: false,
                  message: '请输入价格',
                },
              ],
              initialValue: price,
            })(<InputNumber precision={2} placeholder="请输入" style={{ width: '100%' }} />)}
          </FormItem>
        </div>
      </Col>
    );
  };

  renderGroupPrice = () => {
    const {
      form,
      selectedSKu: { price, child_price: childPrice },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <Col span={12}>
          <div className={styles.formItem}>
            <FormItem label="成人价">
              {getFieldDecorator('price', {
                rules: [
                  {
                    required: false,
                    message: '请输入成人价格',
                  },
                ],
                initialValue: price,
              })(<InputNumber precision={2} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.formItem}>
            <FormItem label="儿童价">
              {getFieldDecorator('child_price', {
                rules: [
                  {
                    required: false,
                    message: '请输入儿童价格',
                  },
                ],
                initialValue: childPrice,
              })(<InputNumber precision={2} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </div>
        </Col>
      </Fragment>
    );
  };

  render() {
    const {
      form,
      model = 'range',
      itemType = 'GROUP',
      selectedSKu: { stock, lag },
      settings = ['price', 'stock', 'lag', 'fee'],
    } = this.props;
    const { feeP, feeT } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={16}>
            {model === 'range' ? this.renderDateRange() : this.renderDateSingle()}
            {settings.includes('price') &&
              (itemType === 'GROUP' ? this.renderGroupPrice() : this.renderSigelPrice())}
            {settings.includes('stock') && (
              <Col span={12}>
                <div className={styles.formItem}>
                  <FormItem label="库存">
                    {getFieldDecorator('stock', {
                      rules: [
                        {
                          required: false,
                          message: '请设置库存',
                        },
                      ],
                      initialValue: stock,
                    })(
                      <InputNumber
                        precision={0}
                        min={0}
                        placeholder="请输入"
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </div>
              </Col>
            )}
            {settings.includes('lag') && (
              <Col span={12}>
                <div className={styles.formItem}>
                  <FormItem label="提前天数">
                    {getFieldDecorator('lag', {
                      rules: [
                        {
                          required: false,
                          message: '请设置提前天数',
                        },
                      ],
                      initialValue: lag,
                    })(
                      <InputNumber
                        precision={0}
                        min={0}
                        placeholder="请输入"
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </div>
              </Col>
            )}
            {settings.includes('fee') && (
              <Fragment>
                <Col span={24}>
                  <div className={styles.formTitle}>佣金计划</div>
                </Col>
                <Col span={12}>
                  <div className={styles.subTitle}>店返</div>
                  {feeLevels.map((fee, index) => (
                    <div className={styles.feeWrap} key={`feeP${fee}`}>
                      <FormItem label={`${fee}级`}>
                        {getFieldDecorator(`feeP${index}`, {
                          rules: [
                            {
                              required: false,
                              message: '请输入佣金',
                            },
                          ],
                          initialValue: feeP && feeP[index],
                        })(
                          <InputNumber
                            placeholder="请输入"
                            style={{ width: '80%' }}
                            precision={2}
                            onChange={val => this.handleFeeChange(val, 'feeP', index)}
                          />
                        )}
                      </FormItem>
                      {index > 0 && (
                        <a
                          onClick={() => this.handleFillFee('feeP', index)}
                          className={styles.feeBtn}
                        >
                          同上
                        </a>
                      )}
                    </div>
                  ))}
                </Col>
                <Col span={12}>
                  <div className={styles.subTitle}>团返</div>
                  {feeLevels.map((fee, index) => (
                    <div className={styles.feeWrap} key={`feeT${fee}`}>
                      <FormItem label={`${fee}级`}>
                        {getFieldDecorator(`feeT${index}`, {
                          rules: [
                            {
                              required: false,
                              message: '请输入佣金',
                            },
                          ],
                          initialValue: feeT && feeT[index],
                        })(
                          <InputNumber
                            placeholder="请输入"
                            style={{ width: '80%' }}
                            precision={2}
                            onChange={val => this.handleFeeChange(val, 'feeT', index)}
                          />
                        )}
                      </FormItem>
                      {index > 0 && (
                        <a
                          onClick={() => this.handleFillFee('feeT', index)}
                          className={styles.feeBtn}
                        >
                          同上
                        </a>
                      )}
                    </div>
                  ))}
                </Col>
              </Fragment>
            )}
            <Col span={24}>
              <div className={styles.formBtnWrap}>
                <Button type="primary" onClick={this.handleOnSave}>
                  保存
                </Button>
                <Button type="danger" style={{ marginLeft: 32 }} onClick={() => form.resetFields()}>
                  重置
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
