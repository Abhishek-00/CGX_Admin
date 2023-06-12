import { useState, useEffect } from 'react';
import BackgroundAPIClient from '../../services/backgroundActions';
import Image from '../../components/ImageComponent';
import { Spin } from 'antd';
import styles from './style.less';
import type { BackgroundImageType } from './data';

export default function BackgroundImageCompetent({ url, alt, className, returnUrl }: any) {
  const [loading, setLoading] = useState<boolean>();
  const [imageUrl, setImgUrl] = useState<BackgroundImageType>({
    base64_content: '',
    file_type: '',
  });

  const getBackgroundUrl = async () => {
    setLoading(true);
    const getImage: any = await BackgroundAPIClient.getBackgroundImage(url);
    if (getImage) {
      setImgUrl(getImage);
      returnUrl(getImage);
    }
    setLoading(false);
  };

  useEffect(() => {
    getBackgroundUrl();
  }, []);

  return loading ? (
    <Spin size="small">
      <div className={styles.content} />
    </Spin>
  ) : (
    <Image url={imageUrl} alt={alt} className={className} />
  );
}
