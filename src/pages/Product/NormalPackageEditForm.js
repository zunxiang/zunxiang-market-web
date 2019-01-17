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
    const { loading, cancelCallback, packageName, room, type, form } = this.props;
    const { content, loadingContent } = this.state;
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
        {!loadingContent ? (
          <Editor
            form={form}
            initialValue={content}
            name="content"
            label="套餐详情"
            formItemLayout={formItemLayout}
            editorOptions={{
              initialFrameHeight: 350,
              initialFrameWidth: 350,
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
