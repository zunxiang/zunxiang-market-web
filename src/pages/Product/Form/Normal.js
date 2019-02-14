import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Card, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AreaSelector from '@/components/AreaSelector';
import { BasicFormItem } from './BasicFormItem';
import MapFormItem from './MapFormItem';
import { submitFormLayout, formItemLayout } from './common';
import { Editor } from '@/components/FormItems/Editor';
import './style.less';

const FormItem = Form.Item;
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
        const { map, images, tags, destination, ...values } = fieldsValue;
        let params = {
          ...values,
          images: images.map(f => f.response.hash).join(','),
          tags: tags.join(','),
          type,
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
    const { submitting, form } = this.props;
    const { getFieldDecorator } = form;
    const { type, current, model } = this.state;
    const initialValue = {
      type,
      model,
      ...current,
    };
    const destination = [current.termini_province, current.termini_city];
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title={current.name}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            layout="vertical"
          >
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
                    initialFrameWidth: 350,
                  }}
                  name="content"
                  label="产品详情"
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
