import { useState, useEffect } from 'react';
import CamoAPIClient from '../../services/camosActions';
import type { CamoImageType } from '../../pages/Camos/data';
import Image from '../../components/ImageComponent';
import { Spin } from 'antd';
import styles from './style.less';

export default function CamoImageCompetent({
  url,
  alt,
  classNameStyle,
  returnUrl,
  isDropdown,
  isSession,
}: any) {
  const [loading, setLoading] = useState<boolean>();
  // const [imageUrl, setImgUrl] = useState<CamoImageType>({
  //   base64_content: '',
  //   file_type: '',
  // });
  const [imageUrl, setImgUrl] = useState(url);
  const getImageUrl = async () => {
    setLoading(true);
    // const getImage: any = await CamoAPIClient.getCamoImage(url);
    const getImage: any = url;
    console.log(imageUrl);

    if (getImage) {
      setImgUrl(getImage);
      if (returnUrl) returnUrl(getImage);
      setLoading(false);
    }
  };

  useEffect(() => {
    getImageUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <Spin size="small">
      {isSession ? (
        <div className={styles.sessionContent} />
      ) : (
        <div className={!isDropdown ? styles.content : null} />
      )}
    </Spin>
  ) : (
    <img src={`${imageUrl}`} alt={alt} className={classNameStyle} loading="lazy" />
    // <Image url={imageUrl} alt={alt} className={classNameStyle} />
  );
}
