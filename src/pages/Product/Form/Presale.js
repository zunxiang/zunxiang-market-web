import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Card, Row, Col, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';
import currency from 'currency.js';
import { parse } from 'qs';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AreaSelector from '@/components/AreaSelector';
import { Editor } from '@/components/FormItems/Editor';
import { BasicFormItem } from './BasicFormItem';
import MapFormItem from './MapFormItem';
import PresaleInfo from './PresaleInfo';
import { submitFormLayout, formItemLayout } from './common';
import styles from './style.less';

const FormItem = Form.Item;
const feeLevels = ['一', '二', '三', '四', '五'];

@connect(({ normal, loading }) => ({
  normal,
  submitting: loading.models.normal,
}))
@Form.create()
export default class ItemMainForms extends PureComponent {
  constructor(props) {
    super(props);
    const {
      location: { search },
      normal: { current },
    } = props;
    const { model, type } = parse(search, { ignoreQueryPrefix: true });
    const parseCurrent = {
      ...current,
      initLoaction: current.origin_tx_location || { lat: 23.12908, lng: 113.26436 },
    };
    this.state = {
      model,
      type,
      current: parseCurrent,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      model,
      type,
      current: { i },
    } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const {
          map,
          images,
          tags,
          destination,
          price,
          presaleTime,
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
          ...values
        } = fieldsValue;
        const feeP = [feeP0, feeP1, feeP2, feeP3, feeP4].map(val =>
          val ? currency(val).intValue : 0
        );
        const feeT = [feeT0, feeT1, feeT2, feeT3, feeT4].map(val =>
          val ? currency(val).intValue : 0
        );
        let params = {
          ...values,
          images: images.map(f => f.response.hash).join(','),
          tags: tags.join(','),
          type,
          presales_begin_time: presaleTime[0].format('YYYY-MM-DD HH:mm:ss'),
          presales_end_time: presaleTime[1].format('YYYY-MM-DD HH:mm:ss'),
          price: currency(price).intValue,
          fee: JSON.stringify([feeP, feeT]),
          item_class: 'RUSH',
        };
        if (type === 'GROUP') {
          const [province, city] = destination;
          params.termini_country = '中国';
          params.termini_province = province;
          params.termini_city = city;
        }
        const {
          address,
          addressComponents: { city, country, province },
          location,
        } = map;
        params = {
          ...params,
          origin_country: country,
          origin_province: province,
          origin_city: city,
          origin_address: address,
          origin_tx_location: JSON.stringify(location),
        };
        if (model === 'add') {
          dispatch({
            type: 'normal/publicAdd',
            payload: params,
            callback: res => {
              dispatch(routerRedux.push(`/product/normal/detail?i=${res}`));
            },
          });
        } else if (model === 'edit') {
          dispatch({
            type: 'normal/publicPost',
            payload: {
              ...params,
              i,
            },
            callback: () => {
              dispatch(routerRedux.push(`/product/normal/detail?i=${i}`));
            },
          });
        }
      }
    });
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.go(-1));
  };

  render() {
    const {
      submitting,
      form,
      normal: { smsTemp },
    } = this.props;
    const { getFieldDecorator } = form;
    const { type, current, model } = this.state;
    const initialValue = {
      type,
      model,
      sms_template: smsTemp[type],
      ...current,
      price: current.price / 100,
    };
    const destination = [current.termini_province, current.termini_city];
    const [feeP, feeT] = current.fee || [[], []];
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title={current.name}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            layout="vertical"
          >
            <Card title="基本信息">
              <Row gutter={32}>
                <Col lg={14} md={24} sm={24}>
                  <BasicFormItem form={form} initialValue={initialValue} />
                  <MapFormItem
                    form={form}
                    initialValue={initialValue}
                    label={type === 'GROUP' ? '出发地' : '地址'}
                    fieldName="map"
                  />
                  {type === 'GROUP' ? (
                    <AreaSelector
                      fieldName="destination"
                      label="目的地"
                      required
                      formItemLayout={formItemLayout}
                      initialValue={destination}
                      getFieldDecorator={getFieldDecorator}
                      level={2}
                    />
                  ) : null}
                </Col>
                <Col lg={10} md={24} sm={24}>
                  <Editor
                    form={form}
                    formItemLayout={formItemLayout}
                    initialValue={initialValue.content}
                    editorOptions={{
                      initialFrameHeight: type === 'HOTEL' ? 750 : 550,
                      initialFrameWidth: 'auto',
                    }}
                    name="content"
                    label="产品详情"
                  />
                </Col>
              </Row>
            </Card>
            <Card title="预售信息" style={{ marginTop: 16 }}>
              <PresaleInfo form={form} initialValue={initialValue} />
            </Card>
            <Card title="佣金计划" style={{ marginTop: 16 }}>
              <div className={styles.tableListForm}>
                <Row>
                  <Col span={2}>
                    <h3>店返</h3>
                  </Col>
                  {feeLevels.map((fee, index) => (
                    <Col span={4} key={`feeP${fee}`}>
                      <FormItem label={`${fee}级`}>
                        {getFieldDecorator(`feeP${index}`, {
                          rules: [
                            {
                              required: false,
                              message: '请输入佣金',
                            },
                          ],
                          initialValue: feeP && feeP[index] / 100,
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
                <Row>
                  <Col span={2}>
                    <h3>团返</h3>
                  </Col>
                  {feeLevels.map((fee, index) => (
                    <Col span={4} key={`feeT${fee}`}>
                      <FormItem label={`${fee}级`}>
                        {getFieldDecorator(`feeT${index}`, {
                          rules: [
                            {
                              required: false,
                              message: '请输入佣金',
                            },
                          ],
                          initialValue: feeT && feeT[index] / 100,
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
              </div>
            </Card>
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
