import * as React from 'react';
import { Button, Card, Col, Row, Upload, message, Icon, Modal } from 'antd';
import { BaseImgUrl, getQiniuToken } from '@/common/config';


import './style.less'

export interface IPosterProps  {
  data: string[],
  onUpload: (data: string[]) => void,
}

export interface IPostState {
  token?: string,
  uploading: boolean,
}

const { confirm } = Modal;
export default class Poster extends React.Component<IPosterProps, IPostState> {
  defaultPorps = {
    data: [],
  }

  state = {
    token: '',
    uploading: false,
  }

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
    const { onUpload, data } = this.props;
    if (status === 'uploading') {
      this.setState({ uploading: true });
    }
    if (status === 'done') {
      this.setState({ uploading: false });
      const newData = [...data, file.response.hash];
      onUpload(newData)
    }
  };

  handleRemove = img => {
    confirm({
      title: '确认信息',
      content: '确认删除这张海报吗？',
      onOk: () => {
        const { data, onUpload } = this.props;
        const newData = data.filter(s => s!== img );
        onUpload(newData)
      },
      okText: '确认',
      cancelText: '取消',
    })
  }

  renderUpload = () => {
    const { uploading, token } = this.state;
    const uploadProps = {
      action: 'http://up-z2.qiniu.com',
      data: {
        token,
      },
      showUploadList: false,
      className: 'upload-list-inline',
      beforeUpload: this.handleBeforUpload,
      onChange: this.handleUploadChange,
    };
    return (
      <Upload {...uploadProps}>
        <Button type="primary" loading={uploading}>上传海报</Button>
      </Upload>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <Card
        title="分享海报"
        extra={this.renderUpload()}
      >
        <Row gutter={16}>
          {data.map(img => {
            return (
              <Col span={4} key={img} style={{ position: 'relative', border: '1px solid #e8e8e8' }}>
                <Icon
                  type="close"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => this.handleRemove(img)}
                />
                <img src={BaseImgUrl + img} alt="海报图片" style={{ width: '100%' }} />
              </Col>
            )
          })}
        </Row>
      </Card>
    )
  }

}

