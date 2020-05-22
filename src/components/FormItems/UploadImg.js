import React, { Component } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Upload, Button } from 'antd';
import { getQiniuToken } from '../../common/config';

const FormItem = Form.Item;

export default class UploadImg extends Component {
  state = {
    token: null,
    upLoading: false,
  };

  handleBeforUpload = () =>
    getQiniuToken().then(token => {
      this.setState({
        token,
      });
    });

  handleUploadChange = ({ file, fileList }) => {
    const { status } = file;
    if (status === 'uploading') {
      this.setState({
        upLoading: true,
      });
    }
    if (status === 'done') {
      this.setState({
        upLoading: false,
      });
    }
    return fileList;
  };

  imageFile = e => {
    const { max } = this.props;
    if (Array.isArray(e)) {
      if (max && e.length) {
        e.splice(e.length - max, max);
      }
      return e;
    }
    if (max && e && e.fileList && e.fileList.length > max) {
      return e.fileList.splice(e.fileList.length - max, max);
    }
    return e && e.fileList;
  };

  render() {
    const formItemLayout = this.props.layout || {
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
    const { label, name, error, getFieldDecorator, defaultList = [], required } = this.props;
    const { token, upLoading } = this.state;
    const uploadProps = {
      action: '//up-z2.qiniup.com',
      data: {
        token,
      },
      showUploadList: true,
      listType: 'picture',
      beforeUpload: this.handleBeforUpload,
      onChange: this.handleUploadChange,
    };
    return (
      <FormItem {...formItemLayout} label={label}>
        {getFieldDecorator(name, {
          valuePropName: 'fileList',
          getValueFromEvent: this.imageFile,
          rules: [
            {
              required: required === undefined ? true : required,
              type: 'array',
              min: 1,
              message: error,
            },
          ],
          initialValue: defaultList,
        })(
          <Upload {...uploadProps}>
            <Button>
              <LegacyIcon type={upLoading ? 'loading' : 'upload'} />
              点击上传
            </Button>
          </Upload>
        )}
      </FormItem>
    );
  }
}
