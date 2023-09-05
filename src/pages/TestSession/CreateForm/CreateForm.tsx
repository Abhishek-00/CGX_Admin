import React, { useState, useRef, useEffect } from 'react';
import { ProFormDatePicker, ProFormSelect, ProFormText, StepsForm } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { useSelector } from 'react-redux';
import { message, Modal, List, Switch, Space } from 'antd';
import type { SESSION, otherSessionDataType, selectedBgAndCamo } from '../data';
import type { TableListItem } from '../../user/userTableList/data';
import type { BackgroundTypes } from '../../Backgrounds/data';
import type { CamoTypes } from '../../Camos/data';
import Image from '../../../components/ImageComponent';
import styles from '../style.less';
import moment from 'moment';

import SessionAPIClient from '../../../services/testSessionActions';
import BackgroundForm from './BackgroundForm';
import CamoForm from './CamoForm';

type CreateFormProps = {
  currentRow?: SESSION.TableListItem;
  modalVisible: boolean;
  onCancel: any;
  getList: any;
  isEdit: boolean;
  getBgData: () => void;
  getCamoData: () => void;
};

const getFormData = (values: any) => {
  const formData = new FormData();
  formData.append('test_name', values.test_name);
  formData.append('end_date', values.end_date);
  formData.append('session_end_date', values.end_date);
  formData.append('user_id', `[${values.user_id?.toString()}]`);
  formData.append('background_id', `[${values.bgIndexes.toString()}]`);
  formData.append('camo_id', `[${values.camoIndexes.toString()}]`);
  formData.append('is_active', values.is_active);
  return formData;
};

const handleAddSession = async (values: any, isBack: (val: boolean) => void) => {
  const payload = getFormData(values);
  const response = await SessionAPIClient.createTestSession(payload);
  if (response.code === 200) {
    message.success('test session created successfully!');
    isBack(false);
  }
};
const handleEditSession = async (id: any, values: any, isBack: (val: boolean) => void) => {
  const payload = getFormData(values);
  const response = await SessionAPIClient.updateTestSession(id, payload);
  if (response.code === 200) {
    message.success('test session updated successfully!');
    isBack(false);
  } else if (response.message === 'unknown error') {
    message.success('Can not update camo title!');
  }
};

const CreateForm: React.FC<CreateFormProps> = ({
  currentRow,
  modalVisible,
  onCancel,
  getList,
  isEdit,
  getBgData,
  getCamoData,
}) => {
  const formRef = useRef<ProFormInstance>();
  const { users } = useSelector((state: any) => state.User);

  const [selectedData, setSelectedData] = useState<selectedBgAndCamo>({
    bgData: [],
    camoData: [],
    userData: [],
  });
  const [stepCount, setStepCount] = useState<number>(0);
  const [activeBtn, setActiveBtn] = useState<number>(1);
  const [selectedBGIndexes, setSelectedBGIndexes] = useState<any[]>([]);
  const [selectedCamoIndexes, setSelectedCamoIndexes] = useState<any[]>([]);
  const [sessionFormData, setSessionFormData] = useState<otherSessionDataType>();

  const resetDataForm = (val: boolean) => {
    formRef?.current?.resetFields();
    onCancel(val);
    setSelectedBGIndexes([]);
    setSelectedCamoIndexes([]);
    setSelectedData({ bgData: [], camoData: [], userData: [] });
    setStepCount(0);
  };

  useEffect(() => {
    setStepCount(0);
    if (isEdit) {
      if (currentRow) {
        formRef.current?.setFieldsValue({
          end_date: new Date(currentRow.session_end_date),
          test_name: currentRow.test_name,
          user_id: currentRow.user_id.split(','),
        });
        setActiveBtn(currentRow.status);

        const bgIds = currentRow.background_id.replace(', ', ',').split(',');
        const camoIds = currentRow.camo_id.replace(', ', ',').split(',');
        const backgroundData = [];
        const camoData = [];
        if (bgIds.length) {
          const bgNames = currentRow.background_name.replace(', ', ',').split(',');
          const bgUrls = currentRow.background_url.replace(', ', ',').split(',');
          for (let ind = 0; ind < bgIds.length; ind++) {
            setSelectedBGIndexes((prev) => [...prev, parseInt(bgIds[ind])]);
            backgroundData.push({
              background_id: parseInt(bgIds[ind]),
              background_name: bgNames[ind],
              background_url: bgUrls[ind],
            });
          }
        }
        if (camoIds.length) {
          const camoNames = currentRow.camo_name.replace(', ', ',').split(',');
          const camoUrls = currentRow.camo_url.replace(', ', ',').split(',');
          for (let ind = 0; ind < camoIds.length; ind++) {
            setSelectedCamoIndexes((prev) => [...prev, parseInt(camoIds[ind])]);
            camoData.push({
              camo_id: parseInt(camoIds[ind]),
              camo_name: camoNames[ind],
              camo_url: camoUrls[ind],
            });
          }
        }
        setSelectedData({
          userData: currentRow.user_id.split(','),
          bgData: backgroundData,
          camoData: camoData,
        });
      }
    } else {
      formRef.current?.setFieldsValue({
        end_date: new Date(),
        test_name: '',
        user_id: [],
      });
      setSelectedData({ userData: [], bgData: [], camoData: [] });
      setSelectedBGIndexes([]);
      setSelectedCamoIndexes([]);
    }

    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentRow]);

  const handleFinish = (values: any) => {
    if (!isEdit) {
      handleAddSession(
        { ...values, bgIndexes: selectedBGIndexes, camoIndexes: selectedCamoIndexes },
        (val: boolean) => {
          getList();
          resetDataForm(val);
        },
      );
    } else {
      handleEditSession(
        currentRow?.test_id,
        {
          ...values,
          bgIndexes: selectedBGIndexes,
          camoIndexes: selectedCamoIndexes,
          is_active: activeBtn,
        },
        (val: boolean) => {
          getList();
          resetDataForm(val);
        },
      );
    }
  };

  return (
    <StepsForm
      current={stepCount}
      onCurrentChange={(count) => setStepCount(count)}
      formRef={formRef}
      onFinish={async (values) => {
        handleFinish(values);
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            title={isEdit ? 'Edit Test Session' : 'Add Test Session'}
            width={1000}
            onCancel={() => onCancel(false)}
            open={modalVisible}
            footer={submitter}
            destroyOnClose
          >
            {dom}
          </Modal>
        );
      }}
    >
      <StepsForm.StepForm
        name="background"
        title="Select Background"
        onFinish={async () => {
          if (!selectedData.bgData.length) {
            message.warning('Please select Backgrounds!');
            return false;
          }
          return true;
        }}
      >
        <BackgroundForm
          selectedIndexes={selectedBGIndexes}
          setSelectedIndexes={(val: number[]) => setSelectedBGIndexes(val)}
          targetKeys={selectedData.bgData}
          setSelectedData={(val: BackgroundTypes[]) => {
            setSelectedData((prev: selectedBgAndCamo) => ({ ...prev, bgData: val }));
          }}
          currentRow={currentRow}
          isEdit={isEdit}
          getBgData={() => getBgData()}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="camo"
        title="Select Camo"
        onFinish={async () => {
          if (!selectedData.camoData.length) {
            message.warning('Please select Camos!');
            return false;
          }
          return true;
        }}
      >
        <CamoForm
          selectedIndexes={selectedCamoIndexes}
          setSelectedIndexes={(val: number[]) => setSelectedCamoIndexes(val)}
          targetKeys={selectedData.camoData}
          setSelectedData={(val: CamoTypes[]) => {
            setSelectedData((prev: selectedBgAndCamo) => ({ ...prev, camoData: val }));
          }}
          currentRow={currentRow}
          isEdit={isEdit}
          getCamoData={() => getCamoData()}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="details"
        title="Add test session details"
        initialValues={{
          test_name: isEdit ? currentRow?.test_name : '',
          user_id: isEdit ? currentRow?.users.split(',') : [],
          end_date: isEdit ? currentRow?.session_end_date : new Date(),
        }}
        onFinish={async (val: otherSessionDataType) => {
          setSessionFormData({
            ...val,
            background_id: selectedBGIndexes,
            camo_id: selectedCamoIndexes,
          });
          return true;
        }}
      >
        <ProFormText
          width="md"
          disabled={isEdit}
          name="test_name"
          label="Session name"
          placeholder="Enter test session name"
          requiredMark={false}
          rules={[{ required: true, message: 'Please enter test name' }]}
        />
        <ProFormSelect
          label="Select user"
          mode="multiple"
          name="user_id"
          width="md"
          options={users}
          fieldProps={{
            showSearch: true,
            autoClearSearchValue: true,
            fieldNames: {
              value: 'user_ID',
              label: 'user_fname',
            },
            optionItemRender(item) {
              return `${item.user_fname || '-'} ${item.user_mname || ''} ${item.user_lname || ''}`;
            },
            onChange(value, option) {
              const data = option.map(
                (user: TableListItem) =>
                  `${user.user_fname || '-'} ${user.user_mname || ''} ${user.user_lname || ''}`,
              );
              setSelectedData((prev: selectedBgAndCamo) => ({ ...prev, userData: data }));
            },
          }}
        />
        <ProFormDatePicker
          label="Select End Date"
          width="md"
          name="end_date"
          transform={(value) => {
            return {
              end_date: moment(value).format('YYYY-MM-DD'),
            };
          }}
        />

        {isEdit ? (
          <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <label>Test Session status</label>
            <Switch
              defaultChecked={!!activeBtn}
              onChange={() => setActiveBtn((prev: number) => (prev === 0 ? 1 : 0))}
            />
          </Space>
        ) : null}
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="conform_details"
        title="Review test session details"
        onAbort={() => {
          formRef?.current?.resetFields();
          setStepCount(2);
        }}
      >
        <h3> Review details</h3>
        <p> Test Session Name : {sessionFormData?.test_name}</p>
        <p> User names : {selectedData.userData.toString().replaceAll(',', ', ')}</p>
        <p> backgrounds : </p>
        <List
          grid={{
            gutter: 8,
          }}
          dataSource={selectedData.bgData}
          renderItem={(item) => (
            <List.Item className={styles.cardStyle}>
              <Image
                key={item.background_name}
                url={item.imgUrl}
                alt={item.background_name}
                className={styles.cardStyle}
              />
            </List.Item>
          )}
        />
        <p> Camos : </p>
        <List
          grid={{
            gutter: 8,
          }}
          dataSource={selectedData.camoData}
          renderItem={(item) => (
            <List.Item>
              <Image
                key={item.camo_name}
                url={item.imgUrl}
                alt={item.camo_name}
                className={styles.cardStyle}
              />
            </List.Item>
          )}
        />
        <p>
          {' '}
          Session end date :{' '}
          {sessionFormData?.end_date ? moment(sessionFormData?.end_date).format('L') : ''}
        </p>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default CreateForm;
