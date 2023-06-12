import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Form } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import ConfigAPIClient from '../../../services/configActions';
import ConfirmModel from '../../../components/ConfirmModel';
import type { CamoTag, Pagination } from './data';

const FormItem = Form.Item;

const UserTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const [camoTagList, setCamoTagList] = useState<CamoTag[]>([]);

  const [currentRow, setCurrentRow] = useState<CamoTag>();

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [selectedCamoTags, setSelectedCamoTags] = useState<CamoTag[]>([]);

  const [isModalOpen, setModal] = useState<boolean>(false);
  const [isEditModalOpen, setEditModal] = useState<boolean>(false);

  const [isDeleteData, setDeleteData] = useState<boolean>(false);

  const getAllCamoTags = async () => {
    const hide = message.loading('Loading camo tags list!');
    try {
      const response = await ConfigAPIClient.CamoTag.getCamoTags();
      if (response.code === 200) {
        setCamoTagList(response.data.camotags);
      }
      hide();
      return true;
    } catch (error) {
      hide();
      message.error('Failed to get camo tags data!');
      return false;
    }
  };

  const handleAddCamoTag = async (fields: CamoTag) => {
    const hide = message.loading('adding');
    try {
      await ConfigAPIClient.CamoTag.creatCamoTag({}, { params: fields });
      hide();
      message.success('Camo tag added successfully!');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to add, please try again!');
      return false;
    }
  };

  const handleUpdateCamoTag = async (fields: CamoTag) => {
    const hide = message.loading('updating..');
    try {
      await ConfigAPIClient.CamoTag.updateCamoTag({}, { params: fields });
      hide();
      message.success('Camo tag updated successfully!');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to update, please try again!');
      return false;
    }
  };

  useEffect(() => {
    getAllCamoTags();
  }, []);

  const handleRemoveCamoTags = async (fields: CamoTag[]) => {
    const tagsIds = fields?.map((tag: CamoTag) => tag.tag_id);
    try {
      const success = await ConfigAPIClient.CamoTag.removeCamoTag(tagsIds);
      if (success.code === 200) {
        message.success('Deleted successfully');
        getAllCamoTags();
      }
      return true;
    } catch (error) {
      message.error('Failed to delete, please try again!');
      return false;
    }
  };

  const handleDeleteData = () => {
    setDeleteData(!isDeleteData);
    setCurrentRow(undefined);
  };

  const handleAddEditModal = (camoTag: CamoTag, isOpen: boolean, isEdit: boolean) => {
    form.setFieldsValue({
      tag_name: camoTag?.tag_name,
    });
    setCurrentRow(camoTag);
    setModal(isOpen);
    setEditModal(isEdit);
  };

  /** Internationalization configuration */
  const columns: ProColumns<CamoTag>[] = [
    {
      title: 'ID',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: 'Camo Tag',
      dataIndex: 'tag_name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
      sorter: (a: any, b: any) => a.tag_name.localeCompare(b.tag_name),
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="config" onClick={() => handleAddEditModal(record, true, true)}>
          Edit
        </a>,
        <a
          key="subscribeAlert"
          onClick={() => {
            setCurrentRow(record);
            setDeleteData(!isDeleteData);
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CamoTag, Pagination>
        actionRef={actionRef}
        rowKey="tag_id"
        headerTitle="Camo Tags"
        search={false}
        toolbar={{
          actions: [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleAddEditModal({ tag_name: '', tag_id: 0 }, true, false);
              }}
            >
              <PlusOutlined /> New Camo Tag
            </Button>,
          ],
        }}
        columns={columns}
        dataSource={camoTagList}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedCamoTags(selectedRows);
          },
        }}
        pagination={false}
        options={false}
      />

      {selectedCamoTags?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Selected{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedCamoTags.length}
              </a>{' '}
              items
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemoveCamoTags(selectedCamoTags);
              setSelectedCamoTags([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Bulk deletion
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title={isEditModalOpen ? 'Edit User Type' : 'Add User Type'}
        width="450px"
        visible={isModalOpen}
        onVisibleChange={(visible: boolean) => {
          setModal(visible);
        }}
        submitter={{
          searchConfig: {
            resetText: 'Cancel',
            submitText: isEditModalOpen ? 'Update' : 'Submit',
          },
        }}
        onFinish={async (value) => {
          let success;
          if (!isEditModalOpen) {
            success = await handleAddCamoTag(value as CamoTag);
          } else {
            success = await handleUpdateCamoTag({
              ...value,
              tag_id: currentRow?.tag_id,
            });
          }
          if (success) {
            getAllCamoTags();
            setModal(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        form={form}
      >
        <FormItem
          name="tag_name"
          rules={[
            {
              required: true,
              message: 'Please input your camo tag!',
            },
          ]}
        >
          <Input size="large" placeholder="Enter camo tag" />
        </FormItem>
      </ModalForm>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {currentRow?.tag_name && (
          <ProDescriptions<CamoTag>
            column={2}
            title={currentRow?.tag_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.tag_id,
            }}
            columns={columns as ProDescriptionsItemProps<CamoTag>[]}
          />
        )}
      </Drawer>

      <ConfirmModel
        data={currentRow}
        title="Confirm deleting!"
        content="Are you sure, You want to delete this camo tag?"
        okText="Delete"
        open={isDeleteData}
        onOk={(val: CamoTag) => handleRemoveCamoTags([val])}
        onCancel={handleDeleteData}
      />
    </PageContainer>
  );
};

export default UserTypeList;
