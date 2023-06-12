import React from 'react';

import { Card, Col } from 'antd';
import styles from '../style.less';
import CamoImageCompetent from '../../Camos/CamoImage';
import type { CamoImageType } from '../../Camos/data';

type CreateFormProps = {
  name: any;
  url: any;
  id?: number;
  selectData?: any;
  getReturnUrl: (val: any) => any;
  isSelected: boolean;
};

const ListedData: React.FC<CreateFormProps> = ({
  name,
  url,
  selectData,
  isSelected,
  getReturnUrl,
}) => {
  return (
    <Col className="gutter-row" span={6}>
      <div className={isSelected ? styles.selectedImage : ''}>
        <Card
          className={styles.listCard}
          onClick={() => selectData()}
          cover={
            <CamoImageCompetent
              url={url}
              alt={name}
              returnUrl={(value: CamoImageType) => getReturnUrl(value)}
              isSession
              classNameStyle={styles.camoModelListImage}
            />
          }
        >
          <Card.Meta title={name} />
        </Card>
      </div>
    </Col>
  );
};

export default ListedData;
