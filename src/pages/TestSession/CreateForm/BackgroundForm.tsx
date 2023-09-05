import React, { useState, useEffect } from 'react';
import { Row, Input, Empty, Button } from 'antd';
import { useSelector } from 'react-redux';
import type { BackgroundTypes } from '../../Backgrounds/data';
import type { CamoImageType } from '../../Camos/data';
import styles from '../style.less';
import SelectedData from '../components/SelectedData';
import ListedData from '../components/ListedData';

type propTypes = {
  isEdit: boolean;
  selectedIndexes: any[];
  targetKeys: BackgroundTypes[];
  setSelectedIndexes: any;
  setSelectedData: any;
  currentRow?: any;
  getBgData: () => void;
};

const BackgroundForm: React.FC<propTypes> = ({
  selectedIndexes,
  setSelectedIndexes,
  targetKeys,
  setSelectedData,
  isEdit,
  currentRow,
  getBgData,
}) => {
  const { backgrounds, fetching: backgroundLoading } = useSelector(
    (state: any) => state.Background,
  );
  const [selectedKeys, setSelectedKeys] = useState<BackgroundTypes[]>([]);
  const [search, setSearch] = useState<string>('');
  const [backgroundList, setBackgroundList] = useState<BackgroundTypes[]>([]);
  // select background data
  const onSelectChange = (targetSelectedKeys: BackgroundTypes) => {
    const isIncludedToTarget = targetKeys.map((targetData) => targetData.background_id);
    if (
      (!selectedIndexes.includes(targetSelectedKeys.background_id) ||
        !isIncludedToTarget.some(
          (currentValue) => currentValue === targetSelectedKeys.background_id,
        )) &&
      !selectedKeys.includes(targetSelectedKeys)
    ) {
      setSelectedKeys((prev) => [...prev, targetSelectedKeys]);
      setSelectedIndexes((prev: number[]) => [...prev, targetSelectedKeys?.background_id]);
    } else {
      setSelectedKeys((prev) =>
        prev.filter((data) => data.background_id !== targetSelectedKeys.background_id),
      );
      setSelectedIndexes((prev: number[]) =>
        prev.filter((data) => data !== targetSelectedKeys.background_id),
      );
    }
  };
  // Update to target selected list
  const onChange = () => {
    setSelectedData([...targetKeys, ...selectedKeys]);
    for (let ind = 0; ind < selectedKeys.length; ind++) {
      const indexOfId = backgroundList.findIndex(
        (data) => data.background_id == selectedKeys[ind].background_id,
      );
      if (indexOfId !== -1) backgroundList.splice(indexOfId, 1);
      setBackgroundList([...backgroundList]);
    }
    setSelectedKeys([]);
  };
  // remove from target list
  const handleRemove = (id: number, index: number) => {
    const removedData = targetKeys.splice(index, 1);
    setBackgroundList((prev) => [...prev, ...removedData]);
    setSelectedData([...targetKeys]);
    const indexOfId = selectedIndexes.findIndex((bg) => bg === id);
    if (indexOfId !== -1) selectedIndexes.splice(indexOfId, 1);
    setSelectedIndexes([...selectedIndexes]);
  };

  const updateImageUrl = (url: CamoImageType, index: number) => {
    const data: BackgroundTypes = { ...targetKeys[index], imgUrl: url };
    targetKeys.splice(index, 1, data);
    setSelectedData([...targetKeys]);
  };
  const updateImageUrlList = (url: CamoImageType, index: number) => {
    const data: BackgroundTypes = { ...backgroundList[index], imgUrl: url };
    backgroundList.splice(index, 1, data);
    setBackgroundList([...backgroundList]);
  };

  const handleFilterBackground = () => {
    const filterBackground = backgrounds.filter((background: BackgroundTypes) =>
      background?.background_name?.toLowerCase()?.includes(search.toLowerCase()),
    );
    setBackgroundList(filterBackground);
  };

  useEffect(() => {
    if (backgroundLoading) return;
    if (isEdit && currentRow) {
      const bgIds = currentRow?.background_id.replace(', ', ',').split(',');
      if (bgIds.length) {
        for (let ind = 0; ind < bgIds.length; ind++) {
          const dbIndex = backgrounds.findIndex(
            (bgData: BackgroundTypes) => bgData.background_id == bgIds[ind],
          );
          if (dbIndex !== -1) backgrounds.splice(dbIndex, 1);
        }
      }
      setSelectedIndexes(bgIds);
      setBackgroundList(backgrounds);
    } else {
      getBgData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentRow]); //  <= backgroundLoading
  useEffect(() => {
    handleFilterBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <div className={styles.stepperModel}>
        <div className={styles.imageListHrT}>
          {targetKeys.length ? (
            targetKeys.map((background: BackgroundTypes, index: number) => (
              <SelectedData
                key={background.background_name}
                id={background.background_id}
                name={background.background_name}
                url={background.imgUrl}
                urlLink={background.background_url}
                removeData={() => handleRemove(background.background_id, index)}
                getReturnUrl={(url: CamoImageType) => updateImageUrl(url, index)}
              />
            ))
          ) : (
            <Empty description="Not selected any background" className={styles.noData} />
          )}
        </div>
        <div className={styles.spaceBetween} />
        <div className={styles.selector}>
          <div className={styles.selectorSearch}>
            <Input
              placeholder="Background name"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {selectedKeys?.length > 0 && (
              <Button type="primary" onClick={onChange}>
                Select
              </Button>
            )}
          </div>
          <div className={styles.imageListHr}>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              {backgroundList.map((background: BackgroundTypes, index: number) => (
                <ListedData
                  id={background.background_id}
                  key={background.background_name}
                  name={background.background_name}
                  url={background.background_url}
                  selectData={() => onSelectChange(background)}
                  isSelected={selectedIndexes.includes(background.background_id)}
                  getReturnUrl={(url: CamoImageType) => updateImageUrlList(url, index)}
                />
              ))}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackgroundForm;
