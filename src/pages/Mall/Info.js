import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Form, Row, Col, Button, message, Spin } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Upload from '@/components/FormItems/Upload';
import { BaseImgUrl } from '@/common/config';
import styles from './Style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
    md: { span: 15 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 10 },
  },
};

@connect(({ loading }) => ({
  loading: loading.models.mallSetting,
}))
@Form.create()
class InfoSetting extends PureComponent {
  state = {
    info: {},
  };

  componentDidMount = () => {
    this.handleGetInfo();
  };

  handleGetInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mallSetting/get',
      payload: {},
      callback: data => {
        this.setState({
          info: { ...data },
        });
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'mallSetting/set',
        payload: {
          ...fieldsValue,
          subscription_qrcode: fieldsValue.subscription_qrcode[0].response.hash,
          share_image: fieldsValue.share_image[0].response.hash,
          salesman_join_poster: fieldsValue.salesman_join_poster[0].response.hash,
        },
        callback: () => {
          message.success('保存成功');
        },
      });
    });
  };

  handlerFormatter = value => {
    if (value) {
      return `${parseInt(value, 10)}%`;
    }
    return `${value}%`;
  };

  handlerParser = value => {
    const val = value.replace('%', '');
    if (val) {
      return parseInt(val, 10);
    }
    return val;
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { info } = this.state;
    return (
      <PageHeaderWrapper>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit}>
            <Card title="默认分享信息" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="分享主标题">
                    {getFieldDecorator('share_title', {
                      rules: [
                        {
                          required: true,
                          message: '分享主标题',
                        },
                      ],
                      initialValue: info.share_title,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="分享副标题">
                    {getFieldDecorator('share_subtitle', {
                      rules: [
                        {
                          required: true,
                          message: '请输入分享副标题',
                        },
                      ],
                      initialValue: info.share_subtitle,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <Upload
                    formItemProps={{
                      ...formItemLayout,
                      label: '分享logo',
                    }}
                    filedName="share_image"
                    getFieldDecorator={getFieldDecorator}
                    max={1}
                    fieldOptions={{
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          min: 1,
                          message: '请上传分享logo',
                        },
                      ],
                      initialValue: info.share_image
                        ? [
                            {
                              response: {
                                hash: info.share_image,
                                key: info.share_image,
                              },
                              url: `${BaseImgUrl}${info.share_image}?.png`,
                              thumbUrl: `${BaseImgUrl}${info.share_image}?.png`,
                              status: 'done',
                              uid: -1,
                              name: '分享logo',
                            },
                          ]
                        : [],
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Upload
                    formItemProps={{
                      ...formItemLayout,
                      label: '公众号二维码',
                    }}
                    filedName="subscription_qrcode"
                    getFieldDecorator={getFieldDecorator}
                    max={1}
                    fieldOptions={{
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          min: 1,
                          message: '请上传公众号二维码',
                        },
                      ],
                      initialValue: info.subscription_qrcode
                        ? [
                            {
                              response: {
                                hash: info.subscription_qrcode,
                                key: info.subscription_qrcode,
                              },
                              url: `${BaseImgUrl}${info.subscription_qrcode}?.png`,
                              thumbUrl: `${BaseImgUrl}${info.subscription_qrcode}?.png`,
                              status: 'done',
                              uid: -1,
                              name: '公众号二维码',
                            },
                          ]
                        : [],
                    }}
                  />
                </Col>
              </Row>
            </Card>
            <Card title="基础服务信息">
              <Row>
                <Col span={12}>
                  <Upload
                    formItemProps={{
                      ...formItemLayout,
                      label: '分销邀请海报',
                    }}
                    filedName="salesman_join_poster"
                    getFieldDecorator={getFieldDecorator}
                    max={1}
                    fieldOptions={{
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          min: 1,
                          message: '请上传分销邀请海报',
                        },
                      ],
                      initialValue: info.salesman_join_poster
                        ? [
                            {
                              response: {
                                hash: info.salesman_join_poster,
                                key: info.salesman_join_poster,
                              },
                              url: `${BaseImgUrl}${info.salesman_join_poster}?.png`,
                              thumbUrl: `${BaseImgUrl}${info.salesman_join_poster}?.png`,
                              status: 'done',
                              uid: -1,
                              name: '邀请海报',
                            },
                          ]
                        : [
                            {
                              response: {
                                hash: 'invite_info_new.jpg',
                                key: 'invite_info_new.jpg',
                              },
                              url: `${BaseImgUrl}invite_info_new.jpg`,
                              thumbUrl: `${BaseImgUrl}invite_info_new.jpg`,
                              status: 'done',
                              uid: -1,
                              name: '邀请海报',
                            },
                          ],
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="服务电话">
                    {getFieldDecorator('service_tel', {
                      rules: [
                        {
                          required: true,
                          message: '请输入服务电话',
                        },
                      ],
                      initialValue: info.service_tel,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default InfoSetting;
