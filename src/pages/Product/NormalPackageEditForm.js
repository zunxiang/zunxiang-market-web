import React, { PureComponent } from 'react';
import currency from 'currency.js';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Select, Row, Col, InputNumber } from 'antd';
import { Editor } from '@/components/FormItems/Editor';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 10 },
  },
};

const feeLevels = ['一', '二', '三', '四', '五'];

@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    loadingContent: true,
    content: '',
  };

  componentDidMount() {
    const { menuId, dispatch } = this.props;
    if (menuId) {
      dispatch({
        type: 'normal/getContent',
        payload: { i: menuId },
        callback: res => {
          this.setState({
            content: res.content,
            loadingContent: false,
          });
        },
      });
    } else {
      this.setState({
        loadingContent: false,
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, successCallback, packageId, itemId, type } = this.props;
    form.validateFieldsAndScroll((err, fieldsvalue) => {
      if (!err) {
        const {
          feeP0,
          feeP1,
          feeP2,
          feeP3,
          feeP4,
          feeT0,
          feeT1,
          feeT2,
          feeT3,
          feeT4,
          price,
          ...otherValues
        } = fieldsvalue;
        const params = {
          ...otherValues,
          item_i: itemId,
        };
        if (type === 'GOODS') {
          const feeP = [feeP0, feeP1, feeP2, feeP3, feeP4].map(val =>
            val ? currency(val).intValue : 0
          );
          const feeT = [feeT0, feeT1, feeT2, feeT3, feeT4].map(val =>
            val ? currency(val).intValue : 0
          );
          params.price = currency(price).intValue;
          params.fee = JSON.stringify([feeP, feeT]);
        }
        if (packageId) {
          params.i = packageId;
          dispatch({
            type: 'pack/post',
            payload: params,
            callback: () => {
              if (successCallback) successCallback();
            },
          });
        } else {
          params.sort = 1;
          dispatch({
            type: 'pack/add',
            payload: params,
            callback: () => {
              if (successCallback) successCallback();
            },
          });
        }
      }
    });
  };

  render() {
    const {
      loading,
      cancelCallback,
      packageName,
      room,
      type,
      form,
      fee,
      price,
      stock,
    } = this.props;
    const { content, loadingContent } = this.state;
    const { getFieldDecorator } = form;
    const feeP = fee ? fee[0] : [];
    const feeT = fee ? fee[1] : [];
    return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label="套餐名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入套餐名称',
              },
            ],
            initialValue: packageName,
          })(<Input placeholder="请输入套餐名称" />)}
        </FormItem>
        {type === 'HOTEL' ? (
          <div>
            <FormItem {...formItemLayout} label="床型">
              {getFieldDecorator('room', {
                rules: [
                  {
                    required: true,
                    message: '请选择入床型',
                  },
                ],
                initialValue: room,
              })(
                <Select style={{ with: '100%' }} placeholder="请选择床型">
                  <Option value="大床">大床</Option>
                  <Option value="双床">双床</Option>
                  <Option value="无">无</Option>
                </Select>
              )}
            </FormItem>
          </div>
        ) : null}
        {type === 'GOODS' && (
          <div>
            <FormItem {...formItemLayout} label="价格">
              {getFieldDecorator('price', {
                rules: [
                  { required: true, message: '请输入销售价格' },
                  { type: 'number', min: 0, message: '价格不能小于0' },
                ],
                initialValue: price && price / 100,
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
            <FormItem {...formItemLayout} label="库存">
              {getFieldDecorator('stock', {
                rules: [
                  { required: true, message: '请输入库存' },
                  { type: 'number', min: 0, message: '库存不能小于0' },
                ],
                initialValue: stock,
              })(<InputNumber style={{ width: '100%' }} min={0} />)}
            </FormItem>
            <Row>
              <Col span={3} style={{ textAlign: 'right' }}>
                <h4>店返：</h4>
              </Col>
              <Col span={21}>
                <Row>
                  {feeLevels.map((fe, index) => (
                    <Col span={4} key={`feeP${fe}`}>
                      <FormItem label={`${fe}级`}>
                        {getFieldDecorator(`feeP${index}`, {
                          rules: [
                            {
                              required: false,
                              message: '请输入佣金',
                            },
                          ],
                          initialValue: feeP[index] && feeP[index] / 100,
                        })(
                          <InputNumber
                            placeholder="请输入"
                            style={{ width: '80%' }}
                            precision={2}
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/￥\s?|(,*)/g, '')}
                          />
                        )}
                      </FormItem>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={3} style={{ textAlign: 'right' }}>
                <h4>团返：</h4>
              </Col>
              <Col span={21}>
                <Row>
                  {feeLevels.map((fe, index) => (
                    <Col span={4} key={`feeT${fe}`}>
                      <FormItem label={`${fe}级`}>
                        {getFieldDecorator(`feeT${index}`, {
                          rules: [
                            {
                              required: false,
                              message: '请输入佣金',
                            },
                          ],
                          initialValue: feeT[index] && feeT[index] / 100,
                        })(
                          <InputNumber
                            placeholder="请输入"
                            style={{ width: '80%' }}
                            precision={2}
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/￥\s?|(,*)/g, '')}
                          />
                        )}
                      </FormItem>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        )}
        {!loadingContent ? (
          <Editor
            form={form}
            initialValue={content}
            name="content"
            label="套餐详情"
            formItemLayout={formItemLayout}
            editorOptions={{
              initialFrameHeight: 350,
              initialFrameWidth: 550,
            }}
          />
        ) : null}
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => {
              if (cancelCallback) {
                cancelCallback();
              }
            }}
          >
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }
}
