import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Form, Row, Col, InputNumber, Button, message, Spin } from 'antd';
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
      if (fieldsValue.salesman_commission_percent + fieldsValue.inviter_commission_percent > 100) {
        message.error('佣金占比不能超过100%');
        return;
      }
      dispatch({
        type: 'mallSetting/set',
        payload: {
          ...fieldsValue,
          subscription_qrcode: fieldsValue.subscription_qrcode[0].response.hash,
          share_image: fieldsValue.share_image[0].response.hash,
        },
        callback: () => {
          message.success('保存成功');
        },
      });
    });
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
          <Card title="默认分享信息" className={styles.card} bordered={false}>
            <Form hideRequiredMark onSubmit={this.handleSubmit}>
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
                  <FormItem {...formItemLayout} label="分享logo">
                    <Upload
                      filedName="share_image"
                      getFieldDecorator={getFieldDecorator}
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
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="公众号二维码">
                    <Upload
                      filedName="subscription_qrcode"
                      getFieldDecorator={getFieldDecorator}
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
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="客服电话">
                    {getFieldDecorator('customer_service_tel', {
                      rules: [
                        {
                          required: true,
                          message: '请输入客服电话',
                        },
                      ],
                      initialValue: info.customer_service_tel,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="在线客服id">
                    {getFieldDecorator('meiqia_id', {
                      rules: [
                        {
                          required: true,
                          message: '在线客服id',
                        },
                      ],
                      initialValue: info.meiqia_id,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="邀请人佣金占比">
                    {getFieldDecorator('inviter_commission_percent', {
                      rules: [
                        {
                          required: true,
                          message: '邀请人佣金占比',
                        },
                      ],
                      initialValue: info.inviter_commission_percent,
                    })(
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="分销佣金占比">
                    {getFieldDecorator('salesman_commission_percent', {
                      rules: [
                        {
                          required: true,
                          message: '分销佣金占比',
                        },
                      ],
                      initialValue: info.salesman_commission_percent,
                    })(
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
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
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default InfoSetting;
