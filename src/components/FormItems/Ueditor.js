import React, { useState, useEffect } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import ReactUeditor from 'ifanrx-react-ueditor';
import { BaseImgUrl, getQiniuToken } from '@/common/config';
import styles from './style.less';

const FormItem = Form.Item;

const itemLayout = {
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

const uploadOne = (file, token) =>
  new Promise((resolve, reject) => {
    const serverURL = '//up-z2.qiniup.com';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const successFn = () => {
      const blkRet = JSON.parse(xhr.responseText);
      resolve(BaseImgUrl + blkRet.key);
    };
    const errorFn = () => {
      reject(new Error('上传失败'));
    };
    // xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', file);
    fd.append('token', token);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  });

export const Ueditor = props => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    getQiniuToken().then(tk => {
      setToken(tk);
    });
  }, []);

  const uploadImage = e => {
    const files = Array.from(e.target.files);
    return Promise.all(files.map(file => uploadOne(file, token)));
  };

  const {
    form,
    initialValue = '',
    name = '',
    label,
    required = true,
    editorOptions = {},
    formItemLayout = itemLayout,
  } = props;
  const { getFieldDecorator } = form;
  const layout = formItemLayout;
  let timer = null;
  const updateEditorContent = content => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      form.setFieldsValue({ [name]: content });
      form.validateFields([name], { force: true });
    }, 1000);
  };

  const editorConfig = {
    zIndex: 1001,
    autoHeightEnabled: false,
    autoFloatEnabled: false,
    initialFrameHeight: 500,
    initialFrameWidth: 500,
    lang: 'zh-cn',
    langPath: '/ueditor/lang/',
    ...editorOptions,
    UEDITOR_HOME_URL: `//${location.host}/ueditor/`,
  };

  return (
    <FormItem {...layout} label={label}>
      {getFieldDecorator(name, {
        rules: [
          {
            required,
            message: `请输入${label}`,
          },
        ],
        initialValue,
      })(
        <div style={{ width: '100%' }} className={styles.editWrap}>
          <ReactUeditor
            config={editorConfig}
            onChange={updateEditorContent}
            uploadImage={uploadImage}
            multipleImagesUpload
            plugins={['uploadImage', 'insertCode']}
            ueditorPath="/ueditor"
            value={initialValue}
          />
        </div>
      )}
    </FormItem>
  );
};
