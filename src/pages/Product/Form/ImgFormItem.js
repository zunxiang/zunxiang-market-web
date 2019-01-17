import React, { PureComponent, Fragment } from 'react';
import { Form, Icon, Upload, Modal, message } from 'antd';
import { BaseImgUrl, getQiniuToken } from '@/common/config';
import { formItemLayout } from './common';
import './style.less';

const FormItem = Form.Item;

export default class ImgFormItem extends PureComponent {
  state = {
    upLoading: '',
    previewUrl: undefined,
    previewVisible: false,
  };

  handleBeforUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('产品图片不能大于2MB!');
      return false;
    }
    return getQiniuToken().then(token => {
      this.setState({ token });
    });
  };

  handleUploadChange = ({ file }) => {
    const { status } = file;
    if (status === 'uploading') {
      this.setState({ upLoading: true });
    }
    if (status === 'done') {
      this.setState({ upLoading: false });
    }
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

  imagesFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList.filter(f => f.status);
  };

  renderUpload = () => {
    const { upLoading, token } = this.state;
    const uploadProps = {
      action: 'http://up-z2.qiniu.com',
      data: {
        token,
      },
      showUploadList: true,
      listType: 'picture-card',
      className: 'upload-list-inline',
      beforeUpload: this.handleBeforUpload,
      onPreview: this.handleUploadPreview,
      onChange: this.handleUploadChange,
    };
    return (
      <Upload {...uploadProps}>
        <div>
          <Icon type={upLoading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">上传图片</div>
        </div>
      </Upload>
    );
  };

  render() {
    const { form, initialValue } = this.props;
    const { getFieldDecorator } = form;
    const { previewUrl, previewVisible } = this.state;
    const images = initialValue.images || [];
    const uploadDefualtList = images.map((key, index) => ({
      response: {
        hash: key,
        key,
      },
      url: `${BaseImgUrl}${key}?.png`,
      thumbUrl: `${BaseImgUrl}${key}?.png`,
      status: 'done',
      uid: 0 - (index + 1),
      name: key,
    }));
    return (
      <Fragment>
        <FormItem {...formItemLayout} label="产品图片">
          {getFieldDecorator('images', {
            valuePropName: 'fileList',
            getValueFromEvent: this.imagesFile,
            rules: [{ required: true, type: 'array', min: 1, message: '请上传至少1张产品图片' }],
            initialValue: uploadDefualtList,
          })(this.renderUpload())}
        </FormItem>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="图片预览" style={{ width: '100%' }} src={previewUrl} />
        </Modal>
      </Fragment>
    );
  }
}
