import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  loading: loading.effects['user/changePassword'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleNewPasswordChange = () => {
    const { form } = this.props;
    form.validateFields(['confirm_password'], { force: true });
  };

  checkConfirmPassword = (rule, value, callback) => {
    const { form } = this.props;
    const newPassword = form.getFieldValue('new_password');
    if (value && value === newPassword) {
      callback();
    } else {
      callback('两次密码不一致，请输入确认密码');
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'user/changePassword',
          payload: {
            ...fieldsValue,
          },
          callback: () => {
            message.success('修改成功');
            form.resetFields();
          },
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const { loading } = this.props;
    return (
      <PageHeaderWrapper title="修改密码">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="原密码">
              {getFieldDecorator('old_password', {
                rules: [{ required: true, message: '请输入原密码' }],
              })(<Input type="password" placeholder="请输入原密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('new_password', {
                rules: [
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能小于6位' },
                ],
              })(
                <Input
                  type="password"
                  placeholder="请输入新密码"
                  onChange={this.handleNewPasswordChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('confirm_password', {
                rules: [{ validator: this.checkConfirmPassword }],
              })(<Input type="password" placeholder="请再输一次新密码" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
