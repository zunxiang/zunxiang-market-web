import React, { Component } from 'react';
import { Upload, Button, Icon, Modal, Form } from 'antd';
import { getQiniuToken, BaseImgUrl } from '@/common/config';

const FormItem = Form.Item;

export default class UploadImg extends Component {
  state = {
    token: null,
    upLoading: false,
    previewUrl: undefined,
    previewVisible: false,
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

  handleUploadPreview = file => {
    this.setState({
      previewUrl: BaseImgUrl + file.response.hash,
      previewVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  render() {
    const {
      filedName,
      getFieldDecorator,
      fieldOptions = {},
      uploadOptions = {},
      formItemProps = {},
    } = this.props;
    const { token, upLoading, previewVisible, previewUrl } = this.state;
    const newUploadProps = {
      action: 'http://up-z2.qiniu.com',
      data: {
        token,
      },
      showUploadList: true,
      listType: 'picture',
      beforeUpload: this.handleBeforUpload,
      onChange: this.handleUploadChange,
      onPreview: this.handleUploadPreview,
      ...uploadOptions,
    };
    const newFiledOptions = {
      valuePropName: 'fileList',
      getValueFromEvent: this.imageFile,
      ...fieldOptions,
    };
    return (
      <FormItem {...formItemProps}>
        {getFieldDecorator(filedName, newFiledOptions)(
          <Upload {...newUploadProps}>
            <Button>
              <Icon type={upLoading ? 'loading' : 'upload'} />
              点击上传
            </Button>
          </Upload>
        )}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="图片预览" style={{ width: '100%' }} src={previewUrl} />
        </Modal>
      </FormItem>
    );
  }
}
