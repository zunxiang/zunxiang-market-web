import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Card, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      normal: { currentItem },
    } = this.props;
    const { type } = currentItem;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        let params = {
          ...fieldsValue,
          images: fieldsValue.images.map(f => f.response.hash).join(','),
          tags: fieldsValue.tags.join(','),
          i: currentItem.i,
        };
        if (type === '出境游') {
          params.address = fieldsValue.country + fieldsValue.city;
          params.province = null;
        } else {
          const {
            address,
            addressComponents: { city, country, province },
            location,
          } = fieldsValue.map;
          params = {
            ...params,
            address,
            country,
            city,
            province,
            tx_location: location,
          };
          if (type === '酒店') {
            delete params.address;
          }
          delete params.map;
        }
        dispatch({
          type: 'normal/publicPost',
          payload: params,
          callback: () => {
            dispatch(routerRedux.push(`/normal/detail?i=${currentItem.i}`));
          },
        });
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
      normal: { currentItem },
    } = this.props;
    const initialValue = {
      ...currentItem,
      images: currentItem.images ? currentItem.images.split(',') : [],
      tags: currentItem.tags ? currentItem.tags.split(',') : [],
      initLoaction: currentItem.tx_location
        ? JSON.parse(currentItem.tx_location)
        : { lat: 23.12908, lng: 113.26436 },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title={currentItem.name}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col lg={8} md={24} sm={24}>
                <BasicFormItem form={form} initialValue={initialValue} />
              </Col>
              <Col lg={8} md={24} sm={24}>
                <Editor
                  form={form}
                  formItemLayout={formItemLayout}
                  initialValue={initialValue.content}
                  editorOptions={{
                    initialFrameHeight: 550,
                    initialFrameWidth: 350,
                  }}
                  name="content"
                  label="产品详情"
                />
              </Col>
              <Col lg={8} md={24} sm={24}>
                <MapFormItem form={form} initialValue={initialValue} />
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
