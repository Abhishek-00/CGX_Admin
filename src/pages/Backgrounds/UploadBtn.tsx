import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';

interface propsType {
  onChange?: any;
  value?: string;
  [key: string]: any;
}

const UploadBtn = React.forwardRef((props, ref): any => {
  const { onChange, value }: propsType = props;
  const [fileList, setFileList] = useState<any>([]);

  useEffect(() => {
    if (value) {
      setFileList([
        {
          uid: -1,
          url: value,
          name: value,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUploadChange = (info: any) => {
    console.log('info: ', info);
    setFileList([info.file]);
    if (onChange) onChange([info.file]);
  };

  return (
    <>
      <Dragger
        ref={ref}
        fileList={fileList}
        multiple={false}
        onChange={onUploadChange}
        showUploadList={{ showRemoveIcon: false }}
        accept=".png, .jpeg"
      >
        <PlusOutlined />
        <p className="ant-upload-hint">Upload Image</p>
      </Dragger>
    </>
  );
});

export default UploadBtn;
