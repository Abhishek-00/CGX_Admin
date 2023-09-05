import React, { useState, useEffect } from 'react';
import { Row, Input, Empty, Button } from 'antd';
import { useSelector } from 'react-redux';
import type { CamoTypes, CamoImageType } from '../../Camos/data';
import styles from '../style.less';
import SelectedData from '../components/SelectedData';
import ListedData from '../components/ListedData';

type propTypes = {
  isEdit: boolean;
  selectedIndexes: any[];
  targetKeys: CamoTypes[];
  setSelectedIndexes: any;
  setSelectedData: any;
  currentRow?: any;
  getCamoData: () => void;
};

const CamoForm: React.FC<propTypes> = ({
  selectedIndexes,
  setSelectedIndexes,
  targetKeys,
  setSelectedData,
  isEdit,
  currentRow,
  getCamoData,
}) => {
  const { camos, fetching: camoLoading } = useSelector((state: any) => state.Camo);
  const [selectedKeys, setSelectedKeys] = useState<CamoTypes[]>([]);
  const [search, setSearch] = useState<string>('');
  const [camoList, setCamoList] = useState<CamoTypes[]>([]);
  // select camo data
  const onSelectChange = (targetSelectedKeys: CamoTypes) => {
    const isIncludedToTarget = targetKeys.map((targetData) => targetData.camo_id);
    if (
      (!selectedIndexes.includes(targetSelectedKeys.camo_id) ||
        !isIncludedToTarget.some((currentValue) => currentValue === targetSelectedKeys.camo_id)) &&
      !selectedKeys.includes(targetSelectedKeys)
    ) {
      setSelectedKeys((prev) => [...prev, targetSelectedKeys]);
      setSelectedIndexes((prev: number[]) => [...prev, targetSelectedKeys?.camo_id]);
    } else {
      setSelectedKeys((prev) => prev.filter((data) => data.camo_id !== targetSelectedKeys.camo_id));
      setSelectedIndexes((prev: number[]) =>
        prev.filter((data) => data !== targetSelectedKeys.camo_id),
      );
    }
  };
  // Update to target selected list
  const onChange = () => {
    setSelectedData([...targetKeys, ...selectedKeys]);
    for (let ind = 0; ind < selectedKeys.length; ind++) {
      const indexOfId = camoList.findIndex((data) => data.camo_id == selectedKeys[ind].camo_id);
      if (indexOfId !== -1) camoList.splice(indexOfId, 1);
      setCamoList([...camoList]);
    }
    setSelectedKeys([]);
  };
  // remove from target list
  const handleRemove = (id: number, index: number) => {
    const removedData = targetKeys.splice(index, 1);
    setCamoList((prev) => [...prev, ...removedData]);
    setSelectedData([...targetKeys]);
    const indexOfId = selectedIndexes.findIndex((bg) => bg === id);
    if (indexOfId !== -1) selectedIndexes.splice(indexOfId, 1);
    setSelectedIndexes([...selectedIndexes]);
  };
  const updateImageUrl = (url: CamoImageType, index: number) => {
    const data: CamoTypes = { ...targetKeys[index], imgUrl: url };
    targetKeys.splice(index, 1, data);
    setSelectedData([...targetKeys]);
  };
  const updateImageUrlList = (url: CamoImageType, index: number) => {
    const data: CamoTypes = { ...camoList[index], imgUrl: url };
    camoList.splice(index, 1, data);
    setCamoList([...camoList]);
  };

  const handleFilterCamo = () => {
    const filteredCamo = camos.filter((camo: CamoTypes) =>
      camo?.camo_name?.toLowerCase()?.includes(search.toLowerCase()),
    );
    setCamoList(filteredCamo);
  };

  useEffect(() => {
    if (camoLoading) return;
    if (isEdit && currentRow) {
      const camoIds = currentRow?.camo_id.replace(', ', ',').split(',');
      if (camoIds.length) {
        for (let ind = 0; ind < camoIds.length; ind++) {
          const dbIndex = camos.findIndex((bgData: CamoTypes) => bgData.camo_id == camoIds[ind]);
          if (dbIndex !== -1) camos.splice(dbIndex, 1);
        }
      }
      setSelectedIndexes(camoIds);
      setCamoList(camos);
    } else {
      getCamoData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentRow]);  //  <= camoLoading

  useEffect(() => {
    handleFilterCamo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <div className={styles.stepperModel}>
        <div className={styles.imageListHrT}>
          {targetKeys.length ? (
            targetKeys.map((camo: CamoTypes, index: number) => (
              <SelectedData
                key={camo.camo_name}
                id={camo.camo_id}
                name={camo.camo_name}
                url={camo.imgUrl}
                urlLink={camo.camo_url}
                removeData={() => handleRemove(camo?.camo_id, index)}
                getReturnUrl={(url: CamoImageType) => updateImageUrl(url, index)}
              />
            ))
          ) : (
            <Empty description="Not selected any camo" className={styles.noData} />
          )}
        </div>
        <div className={styles.spaceBetween} />
        <div className={styles.selector}>
          <div className={styles.selectorSearch}>
            <Input
              placeholder="Camo name"
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
              {camoList.map((camo: CamoTypes, index: number) => (
                <ListedData
                  id={camo.camo_id}
                  key={camo.camo_name}
                  name={camo.camo_name}
                  url={camo.camo_url}
                  isSelected={selectedIndexes.includes(camo.camo_id)}
                  selectData={() => onSelectChange(camo)}
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

export default CamoForm;
