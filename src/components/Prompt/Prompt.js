import React, { Component } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import Upload from '../FormItems/Upload';

const FormItem = Form.Item;
const { TextArea } = Input;

/**
 * @param { string } type 表单类型
 * @param { string } filedName 参数名称
 * @param { string } lable 标签
 * @param { function } getFieldDecorator form的构造方法
 * @param { object } filedOptions filed的配置项，详见form的getFieldDecorator配置
 */
const FormItemGenerator = props => {
  const { type, filedName, label, getFieldDecorator, filedOptions = {} } = props;
  if (type === 'textArea') {
    return (
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={label}>
        {getFieldDecorator(filedName, filedOptions)(
          <TextArea placeholder="请输入" rows={5} style={{ wordBreak: 'break-all' }} />
        )}
      </FormItem>
    );
  } if (type === 'upload') {
    return (
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={label}>
        <Upload {...props} />
      </FormItem>
    );
  } 
    return (
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={label}>
        {getFieldDecorator(filedName, filedOptions)(<Input placeholder="请输入" />)}
      </FormItem>
    );
  
};

/**
 * @param { function } onCofirm 点击确认后的回调
 * @param { object } buttonProps 按钮的props
 * @param { object } modalProps modal的props
 * @param { string } buttonText 按钮的文字
 * @param { array } formItems 表单元素list
 */
@Form.create()
export default class Prompt extends Component {
  state = {
    modalVisible: false,
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleMoadlOk = () => {
    const { form, onCofirm } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (onCofirm) onCofirm(fieldsValue);
      this.handleModalVisible(false);
    });
  };

  renderFormItem = () => {
    const {
      formItems,
      form: { getFieldDecorator },
    } = this.props;
    const FormItemList = formItems.map(item => {
      const itemPorps = {
        getFieldDecorator,
        ...item,
      };
      return <FormItemGenerator {...itemPorps} />;
    });
    return FormItemList;
  };

  render() {
    const {
      buttonProps = {
        type: 'primary',
        ghost: true,
      },
      buttonText,
      modalProps = {
        title: '请输入信息',
      },
    } = this.props;
    const { modalVisible } = this.state;
    return (
      <div>
        <Button {...buttonProps}>{buttonText}</Button>
        <Modal
          {...modalProps}
          visible={modalVisible}
          onOk={this.handleMoadlOk}
          onCancel={() => this.handleModalVisible(false)}
        >
          <Form>{this.renderFormItem()}</Form>
        </Modal>
      </div>
    );
  }
}
