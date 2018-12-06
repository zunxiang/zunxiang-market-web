import React, { PureComponent } from 'react';
import { Form, Input, Select, Button } from 'antd';
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
    suppliers: [],
  };

  componentDidMount() {
    const { supplierId } = this.props;
    this.handleFindSupplier('', supplierId);
  }

  handleFindSupplier = (name, id) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'ppackage/searchSupplier',
      payload: {
        currentPage: 1,
        pageSize: 10,
        name: ['like', name],
        i: id,
        limit: '0,10',
      },
      callback: list => {
        this.setState(
          {
            suppliers: list,
          },
          () => {
            if (id) {
              form.setFieldsValue({ supplier_i: id });
            }
          }
        );
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, successCallback, packageId, rushId } = this.props;
    form.validateFieldsAndScroll((err, fieldsvalue) => {
      if (!err) {
        const params = {
          ...fieldsvalue,
          travel_days: 1,
          rush_i: rushId,
        };
        if (packageId) {
          params.i = packageId;
          dispatch({
            type: 'ppackage/post',
            payload: params,
            callback: () => {
              if (successCallback) successCallback();
            },
          });
        } else {
          dispatch({
            type: 'ppackage/add',
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
    const { loading, cancelCallback, packageName, menu, form } = this.props;
    const { getFieldDecorator } = form;
    const { suppliers } = this.state;
    const options = suppliers.map(val => {
      return (
        <Option key={val.name} value={val.i}>
          {val.name}
        </Option>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label="选择供应商">
          {getFieldDecorator('supplier_i', {
            rules: [{ required: true, message: '请搜索并选择供应商' }],
          })(
            <Select
              showSearch
              placeholder="输入供应商进行搜索"
              style={{ width: '100%' }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleFindSupplier}
              optionLabelProp="children"
            >
              {options}
            </Select>
          )}
        </FormItem>
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
        <Editor
          form={form}
          initialValue={{ menu }}
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
