import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Button, Card, InputNumber, Row, Col } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import currency from 'currency.js';
import { routerRedux } from 'dva/router';
import { Editor } from '@/components/FormItems/Editor';
import ImgFormItem from './ImgFormItem';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitFormLayout, formItemLayout } from './common';

import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const feeLevels = ['一', '二', '三', '四', '五'];

@connect(({ presale, loading }) => ({
  presale,
  submitting: loading.models.presale,
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
  };

  componentDidMount() {
    const {
      dispatch,
      presale: { current },
      location: { search },
    } = this.props;
    const query = parse(search, { ignoreQueryPrefix: true });
    if (query.type === 'edit' && !current.i) {
      dispatch(routerRedux.push('/presale/list'));
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      presale: { current },
    } = this.props;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const { presaleTime, price, images, ...other } = fieldsValue;
        const feeP = [];
        const feeT = [];
        for (let i = 0; i < 5; i += 1) {
          feeP[i] = other[`feeP${i}`] ? currency(other[`feeP${i}`]).intValue : 0;
          feeT[i] = other[`feeT${i}`] ? currency(other[`feeT${i}`]).intValue : 0;
          delete other[`feeP${i}`];
          delete other[`feeT${i}`];
        }
        const params = {
          ...other,
          images: images.map(f => f.response.hash).join(','),
          presales_begin_time: presaleTime[0].format('YYYY-MM-DD HH:mm:ss'),
          presales_end_time: presaleTime[1].format('YYYY-MM-DD HH:mm:ss'),
          price: currency(price).intValue,
          fee: JSON.stringify([feeP, feeT]),
          type: 'presale',
        };
        if (current.i) {
          params.i = current.i;
          dispatch({
            type: 'presale/post',
            payload: params,
            callback: data => {
              dispatch(routerRedux.push(`/product/presale/detail?i=${data}`));
            },
          });
        } else {
          dispatch({
            type: 'presale/add',
            payload: params,
            callback: () => {
              dispatch(routerRedux.push(`/product/presale/detail?i=${current.i}`));
            },
          });
        }
      }
    });
  };

  render() {
    const {
      submitting,
      form,
      presale: { current },
    } = this.props;
    const feeP = [];
    const feeT = [];
    const { getFieldDecorator } = form;
    const { query } = this.state;
    const images = current.images ? current.images.split(',') : [];

    return (
      <PageHeaderWrapper key={current.i}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }} layout="vertical">
            <Row gutter={32}>
              <Col lg={8} md={24} sm={24}>
                <ImgFormItem
                  form={form}
                  initialValue={{ images }}
                  formItemLayout={formItemLayout}
                />
                <FormItem {...formItemLayout} label="预售名称">
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: '请输入预售名称',
                      },
                    ],
                    initialValue: current.title,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="预售简介">
                  {getFieldDecorator('intro', {
                    rules: [
                      {
                        required: true,
                        message: '请输入简介',
                      },
                    ],
                    initialValue: current.intro,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="预售时间">
                  {getFieldDecorator('presaleTime', {
                    rules: [
                      {
                        required: true,
                        message: '请选择预售时间',
                      },
                    ],
                    initialValue:
                      query.type !== 'add'
                        ? [moment(current.rush_begin_time), moment(current.rush_end_time)]
                        : [],
                  })(
                    <RangePicker
                      showTime
                      style={{ width: '100%' }}
                      placeholder={['开始日期', '结束日期']}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="通知手机">
                  {getFieldDecorator('notice_mobile', {
                    rules: [
                      {
                        required: true,
                        message: '请输入通知手机',
                      },
                    ],
                    initialValue: current.notice_mobile,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={24} sm={24}>
                <FormItem {...formItemLayout} label="预售数量">
                  {getFieldDecorator('stock', {
                    rules: [
                      { required: true, message: '请输入预售数量' },
                      { type: 'number', min: 0, message: '预售数量不能小于0' },
                    ],
                    initialValue: current.inventory,
                  })(<InputNumber style={{ width: '100%' }} min={0} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="售价">
                  {getFieldDecorator('price', {
                    rules: [
                      { required: true, message: '请输入销售价格' },
                      { type: 'number', min: 0, message: '价格不能小于0' },
                    ],
                    initialValue: current.price && current.price / 100,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                    />
                  )}
                </FormItem>
                <Row>
                  <Col span={24}>
                    <div className={styles.formTitle}>佣金计划</div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.subTitle}>店返</div>
                    {feeLevels.map((fee, index) => (
                      <FormItem label={`${fee}级`} key={`feeP${fee}`}>
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
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/￥\s?|(,*)/g, '')}
                          />
                        )}
                      </FormItem>
                    ))}
                  </Col>
                  <Col span={12}>
                    <div className={styles.subTitle}>团返</div>
                    {feeLevels.map((fee, index) => (
                      <FormItem label={`${fee}级`} key={`feeT${fee}`}>
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
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/￥\s?|(,*)/g, '')}
                          />
                        )}
                      </FormItem>
                    ))}
                  </Col>
                </Row>
              </Col>
              <Col lg={8} md={24} sm={24}>
                <Editor
                  form={form}
                  formItemLayout={formItemLayout}
                  initialValue={current.content}
                  editorOptions={{
                    initialFrameHeight: 550,
                    initialFrameWidth: 'auto',
                  }}
                  name="content"
                  label="图文详情"
                />
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
