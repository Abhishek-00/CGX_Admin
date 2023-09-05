import React from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import type { CamoImageType } from '../../Camos/data';
import { Card, Badge } from 'antd';
import styles from '../style.less';
import Image from '../../../components/ImageComponent';
import CamoImageCompetent from '../../Camos/CamoImage';

type CreateFormProps = {
  name: any;
  url: any;
  urlLink?: string;
  id: number;
  removeData: any;
  getReturnUrl?: (val: any) => any;
};

const SelectedData: React.FC<CreateFormProps> = ({
  name,
  url,
  urlLink,
  removeData,
  getReturnUrl,
}) => {
  return (
    <div style={{ padding: '8px' }}>
      <Badge
        count={<MinusCircleOutlined style={{ color: '#f5222d' }} onClick={() => removeData()} />}
      >
        <Card
          cover={
            urlLink && getReturnUrl && !url ? (
              <CamoImageCompetent
                url={urlLink}
                alt={name}
                returnUrl={(value: CamoImageType) => getReturnUrl(value)}
                classNameStyle={styles.camoModelImage}
                isSession
              />
            ) : (
              <img src={`${url}`} alt={name} className={styles.camoModelImage} loading="lazy" />
              // <Image url={url} alt={name} className={styles.camoModelImage} />
            )
          }
        >
          <Card.Meta title={name} />
        </Card>
      </Badge>
    </div>
  );
};

export default SelectedData;
