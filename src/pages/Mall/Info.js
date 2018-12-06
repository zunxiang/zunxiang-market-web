import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Popconfirm, Input, Badge, Form } from 'antd';
import update from 'immutability-helper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Upload from '@/components/FormItems/Upload';
import styles from './Style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 10 },
  },
};

@Form.create()
export default class InfoSetting extends PureComponent {
  render() {
    const {
      shareTitle,
      shareSubtitle,
      shareImage,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card title="默认分享信息" className={styles.card} bordered={false}>
          <Form hideRequiredMark>
            <FormItem {...formItemLayout} label="分享主标题">
              {getFieldDecorator('share_title', {
                rules: [
                  {
                    required: true,
                    message: '分享主标题',
                  },
                ],
                initialValue: shareTitle,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="分享副标题">
              {getFieldDecorator('share_subtitle', {
                rules: [
                  {
                    required: true,
                    message: '请输入分享副标题',
                  },
                ],
                initialValue: shareSubtitle,
              })(<Input placeholder="请输入" />)}
            </FormItem>
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
                  initialValue: shareImage || [],
                }}
              />
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
