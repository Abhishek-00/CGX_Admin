import React, { useState, useRef, useEffect } from 'react';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  CaretUpFilled,
  UserOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, message, Input, Drawer, Form, Card, Row, Col } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import ConfigAPIClient from '../../../services/configActions';
import ConfirmModel from '../../../components/ConfirmModel';
import styles from './style.less';
import type { UserType, Pagination } from './data';

const FormItem = Form.Item;

const UserTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const [userTypeList, setUserTypeList] = useState<UserType[]>([]);
  const [paginationData, setPaginationData] = useState<Pagination>({});

  const [currentRow, setCurrentRow] = useState<UserType>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [isCollapse, setCollapse] = useState<boolean>(false);

  const [selectedUserTypes, setSelectedUserTypes] = useState<UserType[]>([]);

  const [isModalOpen, setModal] = useState<boolean>(false);
  const [isEditModalOpen, setEditModal] = useState<boolean>(false);

  const [filterParams, setFilterParams] = useState({
    user_type: '',
  });
  const [filterForm] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [itemSize, setItemSize] = useState<number>(10);

  const [isDeleteData, setDeleteData] = useState<boolean>(false);

  const getUserTypes = async () => {
    const hide = message.loading('Loading user type list!');
    try {
      const response = await ConfigAPIClient.UserType.getUserType();
      if (response.code === 200) {
        setUserTypeList(response.data);
        // setPaginationData(response.pagination);
      }
      hide();
      return true;
    } catch (error) {
      hide();
      message.error('Failed to get user data!');
      return false;
    }
  };

  const handleAddUserType = async (fields: UserType) => {
    const hide = message.loading('adding');
    try {
      await ConfigAPIClient.UserType.createUserType(fields);
      hide();
      message.success('User type added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to add, please try again!');
      return false;
    }
  };

  const handleUpdateUserType = async (fields: UserType) => {
    const hide = message.loading('updating..');
    try {
      await ConfigAPIClient.UserType.updateUserType(fields);
      hide();
      message.success('User type updated successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to update, please try again!');
      return false;
    }
  };

  useEffect(() => {
    // if (window.innerWidth < 575) {
    //   setCollapse(true);
    // }

    getUserTypes();
  }, [filterParams]);

  // const handleResize = () => {
  //   if (window.innerWidth < 575) {
  //     setCollapse(true);
  //   } else {
  //     setCollapse(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);
  // });

  const handleRemoveUserType = async (fields: UserType[]) => {
    const userIds = fields?.map((user: UserType) => user.Usertype_ID);
    try {
      const success = await ConfigAPIClient.UserType.removeUserType(userIds);
      if (success.res.code === 200) {
        message.success('Deleted successfully');
        getUserTypes();
      } else throw new Error();
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

  const handleAddEditModal = (userType: UserType, isOpen: boolean, isEdit: boolean) => {
    form.setFieldsValue({
      user_type: userType?.User_type,
    });
    setCurrentRow(userType);
    setModal(isOpen);
    setEditModal(isEdit);
  };

  /** Internationalization configuration */
  const columns: ProColumns<UserType>[] = [
    {
      title: 'ID',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: 'User Type',
      dataIndex: 'User_type',
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
      sorter: (a: any, b: any) => a.User_type.localeCompare(b.User_type),
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
      {/* <Card className={styles.searchWrapperBox}>
        <Form onFinish={(values) => setFilterParams(values)} autoComplete="off" form={filterForm}>
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="user_type" className={styles.formItem}>
                <Input placeholder="User type" type="text" prefix={<UserOutlined />} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4}>
              <div className={styles.searchButtonBox}>
                <div className={isCollapse && styles.colHidden}>
                  <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
                    Search
                  </Button>
                  <div
                    className={styles.clearFilterIcon}
                    title="Clear All"
                    onClick={() => filterForm.resetFields()}
                  >
                    <CloseOutlined />
                  </div>
                </div>
                <a onClick={() => setCollapse(!isCollapse)} className={styles.collapseText}>
                  {isCollapse && <FilterOutlined />} {isCollapse ? 'Filters' : 'Collapse'}{' '}
                  {!isCollapse && <CaretUpFilled />}
                </a>
              </div>
            </Col>
          </Row>
        </Form>
      </Card> */}

      <ProTable<UserType, Pagination>
        actionRef={actionRef}
        rowKey="Usertype_ID"
        headerTitle="User Types"
        search={false}
        toolbar={{
          actions: [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleAddEditModal({ User_type: '', Usertype_ID: 0 }, true, false);
              }}
            >
              <PlusOutlined /> New User Type
            </Button>,
          ],
        }}
        columns={columns}
        dataSource={userTypeList}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedUserTypes(selectedRows);
          },
        }}
        pagination={{
          pageSize: itemSize,
          current: page,
          total: paginationData.total_items,
          showSizeChanger: true,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]} - ${range[1]} of ${total} user types`,
          onChange: (pageNumber: number) => setPage(Number(pageNumber)),
          onShowSizeChange: (current, size) => {
            setItemSize(size);
          },
        }}
        options={false}
      />

      {selectedUserTypes?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Selected{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedUserTypes.length}
              </a>{' '}
              items
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemoveUserType(selectedUserTypes);
              setSelectedUserTypes([]);
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
            success = await handleAddUserType(value as UserType);
          } else {
            success = await handleUpdateUserType({
              ...value,
              Usertype_ID: currentRow?.Usertype_ID,
            });
          }
          if (success) {
            getUserTypes();
            setModal(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        form={form}
      >
        <FormItem
          name="user_type"
          rules={[
            {
              required: true,
              message: 'Please input your user type!',
            },
          ]}
        >
          <Input size="large" placeholder="Enter user type" />
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
        {currentRow?.User_type && (
          <ProDescriptions<UserType>
            column={2}
            title={currentRow?.User_type}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.Usertype_ID,
            }}
            columns={columns as ProDescriptionsItemProps<UserType>[]}
          />
        )}
      </Drawer>

      <ConfirmModel
        data={currentRow}
        title="Confirm deleting!"
        content="Are you sure, You want to delete this user type?"
        okText="Delete"
        open={isDeleteData}
        onOk={(val: UserType) => handleRemoveUserType([val])}
        onCancel={handleDeleteData}
      />
    </PageContainer>
  );
};

export default UserTypeList;
