import React, { PureComponent } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Editor } from '@/components/FormItems/Editor';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
    md: { span: 17 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 10 },
  },
};
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, successCallback, packageId, itemId } = this.props;
    form.validateFieldsAndScroll((err, fieldsvalue) => {
      if (!err) {
        const params = {
          ...fieldsvalue,
          item_i: itemId,
        };
        if (packageId) {
          params.i = packageId;
          dispatch({
            type: 'npackage/post',
            payload: params,
            callback: () => {
              if (successCallback) successCallback();
            },
          });
        } else {
          dispatch({
            type: 'npackage/add',
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
    const { loading, cancelCallback, packageName, menu, content, room, texture, form } = this.props;
    const { getFieldDecorator } = form;
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
        {texture === 'HOTEL' ? (
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
            <FormItem {...formItemLayout} label="套餐包含">
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请输入套餐包含',
                  },
                ],
                initialValue: content,
              })(<Input placeholder="含早餐、门票等" />)}
            </FormItem>
          </div>
        ) : null}
        <Editor
          form={form}
          initialValue={menu}
          name="menu"
          label="套餐详情"
          formItemLayout={formItemLayout}
        />
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
