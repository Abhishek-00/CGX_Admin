import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  CaretUpFilled,
  UserOutlined,
  MailOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, message, Input, Drawer, Form, Select, Card, Row, Col } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UserAPIClient from '../../../services/userActions/userApi';
import type { TableListItem, TableListPagination, UserList } from './data';
import moment from 'moment';
import ConfirmModel from '../../../components/ConfirmModel';
import styles from './style.less';
import { CustomSelect } from '@/components/CustomSelect';
import { readData } from '@/utils/storage';

const FormItem = Form.Item;
// const { Option } = Select;

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('adding');
  try {
    const success = await UserAPIClient.createUser({
      ...fields,
      added_by: 0,
    });
    if (success?.code === 200) {
      hide();
      message.success('Added successfully');
      return true;
    } else {
      message.warning(success?.message);
      return false;
    }
  } catch (error) {
    hide();
    message.error('Failed to add, please try again!');
    return false;
  }
};

const TableList: React.FC = () => {
  const userList = useSelector((state: any) => state.User);

  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState<{ modalType: string; show: boolean }>({
    modalType: 'add',
    show: false,
  });
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [userTypeList, setUserTypeList] = useState<UserList.UserType[]>([]);
  const [userGroupList, setGroupTypeList] = useState<UserList.UserType[]>([]);
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  // const [userDataList, setUserDataList] = useState<TableListItem[]>(userList.users);
  const [currentUser, setCurrentUser] = useState<TableListItem>();
  const [paginationData, setPaginationData] = useState<UserList.Pagination>({});
  const [filterParams, setFilterParams] = useState({});
  const [filterForm] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [itemSize, setItemSize] = useState<number>(10);
  const [isCollapse, setCollapse] = useState<boolean>(false);
  const [isDeleteData, setDeleteData] = useState<boolean>(false);
  const [hideClearBtn, setHideClearBtn] = useState<boolean>(false);

  const setUserFormData = (record: TableListItem) => {
    setCurrentRow(record);
    form.setFieldsValue(record);
    handleModalVisible({ modalType: 'edit', show: true });
  };

  const getUsers = async () => {
    const hide = message.loading('Loading user data!');
    try {
      const response = await UserAPIClient.getUsers(
        {
          user_type: '',
          page_number: page,
          page_size: itemSize,
        },
        { params: filterParams },
      );
      if (response.code === 200) {
        setPaginationData(response.pagination);
      }
      hide();
      return true;
    } catch (error) {
      hide();
      message.error('Failed to get user data!');
      return false;
    }
  };

  const getUserTypes = async () => {
    const response = await UserAPIClient.getUserTypes();
    setUserTypeList(response.userTypeData);
    setGroupTypeList(response.userGrpData);
  };

  const handleUpdateUser = async (fields: TableListItem) => {
    const hide = message.loading('updating..');
    try {
      await UserAPIClient.updateUser(fields);
      hide();
      message.success('User updated successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to update, please try again!');
      return false;
    }
  };

  const getLoginUser = async () => {
    setCurrentUser(await readData('currentUser'));
  };

  useEffect(() => {
    if (window.innerWidth < 575) {
      setCollapse(true);
    }
    getUserTypes();
    getLoginUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemSize, filterParams]);

  const handleRemove = async (fields: TableListItem[]) => {
    const userIds: any = fields?.map((user: TableListItem) => user?.user_ID);
    try {
      await UserAPIClient.removeUser(userIds);
      message.success('Deleted successfully');
      getUsers();
      return true;
    } catch (error) {
      message.error('Failed to add, please try again!');
      return false;
    }
  };

  const sortTable = (record: any) => {
    setFilterParams((prev: any) => ({
      ...prev,
      order_by: record,
      sorting: prev?.sorting === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  /** Internationalization configuration */
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'First Name',
      dataIndex: 'user_fname',
      sorter: true,
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
    },
    {
      title: 'Middle Name',
      dataIndex: 'user_mname',
      sorter: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'user_lname',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      sorter: true,
    },
    {
      title: 'User type',
      dataIndex: 'user_type',
      valueType: 'select',
      request: async () => userTypeList,
      sorter: true,
    },
    {
      title: 'User Group',
      dataIndex: 'group_name',
      valueType: 'select',
      request: async () => userGroupList,
      sorter: true,
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      hideInSearch: true,
      sorter: true,
      renderText: (val: string) => `${moment(val).format('MMM DD, YYYY hh:mm A')}`,
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="config" onClick={() => setUserFormData(record)}>
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

  const handleDeleteData = () => {
    setDeleteData(!isDeleteData);
    setCurrentRow(undefined);
  };

  const handleResize = () => {
    if (window.innerWidth < 575) {
      setCollapse(true);
    } else {
      setCollapse(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  const handleFilter = (val: UserList.UserFilter) => {
    if (
      val.user_fname === '' ||
      val.user_mname === '' ||
      val.user_lname === '' ||
      val.user_email === '' ||
      val.user_type === '' ||
      val.group_name === ''
    ) {
      setFilterParams({});
      setHideClearBtn(false);
    } else {
      setFilterParams(val);
      setHideClearBtn(true);
    }
  };

  const handleResetField = () => {
    filterForm.resetFields();
    setHideClearBtn(false);
    setFilterParams({});
  };

  const checkPhoneValidation = (_: any, value: string) => {
    const promise = Promise;
    if (value && form.getFieldValue('user_phone').length !== 10) {
      return promise.reject('Please enter valid phone number!');
    }
    return promise.resolve();
  };

  return (
    <PageContainer>
      <Card className={styles.searchWrapperBox}>
        <Form
          form={filterForm}
          onFinish={(values) => handleFilter(values)}
          onChange={() => setHideClearBtn(true)}
          autoComplete="off"
        >
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="user_fname" className={styles.formItem}>
                <Input placeholder="First name" type="text" prefix={<UserOutlined />} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="user_mname" className={styles.formItem}>
                <Input placeholder="Middle name" type="text" prefix={<UserOutlined />} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="user_lname" className={styles.formItem}>
                <Input placeholder="Last name" type="text" prefix={<UserOutlined />} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="user_email" className={styles.formItem}>
                <Input placeholder="Email" type="text" prefix={<MailOutlined />} />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="user_type" className={styles.formItem}>
                <CustomSelect
                  prefixIcon={<UserOutlined />}
                  placeholder="User type"
                  options={[{ value: '', label: 'All' }, ...(userTypeList || [])]}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="group_name" className={styles.formItem}>
                <CustomSelect
                  prefixIcon={<UserOutlined />}
                  placeholder="Group name"
                  options={[{ value: '', label: 'All' }, ...(userGroupList || [])]}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4}>
              <div className={styles.searchButtonBox}>
                <div className={isCollapse && styles.colHidden}>
                  <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
                    Search
                  </Button>
                  {hideClearBtn && (
                    <div
                      className={styles.clearFilterIcon}
                      title="Clear All"
                      onClick={handleResetField}
                    >
                      <CloseOutlined />
                    </div>
                  )}
                </div>
                <a onClick={() => setCollapse(!isCollapse)} className={styles.collapseText}>
                  {isCollapse && <FilterOutlined />} {isCollapse ? 'Filters' : 'Collapse'}{' '}
                  {!isCollapse && <CaretUpFilled />}
                </a>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="user_ID"
        headerTitle="Users"
        search={false}
        toolbar={{
          actions: [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setUserFormData({
                  user_fname: '',
                  user_mname: '',
                  user_lname: '',
                  user_email: '',
                  user_phone: '',
                  user_type: undefined,
                  group_name: undefined,
                  user_password: '',
                });
                handleModalVisible({ modalType: 'add', show: true });
              }}
            >
              <PlusOutlined /> New User
            </Button>,
          ],
        }}
        columns={columns}
        // dataSource={userDataList}
        dataSource={userList.users}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          pageSize: itemSize,
          current: page,
          total: paginationData.total_items,
          showSizeChanger: true,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]} - ${range[1]} of ${total} users`,
          onChange: (pageNumber: number) => setPage(Number(pageNumber)),
          onShowSizeChange: (current, size) => {
            setItemSize(size);
          },
        }}
        options={false}
        onChange={(pagination, filters, sorter: any) => {
          sortTable(sorter?.columnKey);
        }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Selected{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              items
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Bulk deletion
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title={createModalVisible.modalType === 'edit' ? 'Edit User' : 'Add User'}
        initialValues={createModalVisible.modalType === 'edit' ? { ...currentRow } : {}}
        width="450px"
        visible={createModalVisible.show}
        onVisibleChange={(visible: boolean) => {
          handleModalVisible((prevVal) => ({ ...prevVal, show: visible }));
        }}
        submitter={{
          searchConfig: {
            resetText: 'Cancel',
            submitText: createModalVisible.modalType === 'edit' ? 'Update' : 'Submit',
          },
        }}
        onFinish={async (value) => {
          let success;
          if (createModalVisible.modalType !== 'edit') {
            success = await handleAdd(value as TableListItem);
          } else {
            success = await handleUpdateUser({
              user_ID: currentRow?.user_ID,
              ...value,
            } as TableListItem);
          }
          if (success) {
            getUsers();
            handleModalVisible((prevVal) => ({ ...prevVal, modalType: 'add', show: false }));
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onReset={() => {
          getUsers();
          setCurrentRow(undefined);
          handleModalVisible((prevVal) => ({ ...prevVal, modalType: 'add', show: false }));
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        form={form}
      >
        <FormItem
          name="user_fname"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input your first name!',
            },
          ]}
        >
          <Input placeholder="Enter first name" />
        </FormItem>
        <FormItem name="user_mname" validateTrigger="onBlur">
          <Input placeholder="Enter middle name" />
        </FormItem>
        <FormItem
          name="user_lname"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input your last name!',
            },
          ]}
        >
          <Input placeholder="Enter last name" />
        </FormItem>
        <FormItem
          name="user_email"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
            {
              type: 'email',
              message: 'Email address format error!',
            },
          ]}
        >
          <Input name="user_email" placeholder="Enter email" />
        </FormItem>
        <FormItem
          name="user_type"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please select user type!',
            },
          ]}
        >
          <Select placeholder="Select user type" options={userTypeList} />
        </FormItem>
        <FormItem
          name="user_phone"
          rules={[
            { required: true, message: 'Please input your phone number!' },
            {
              validator: checkPhoneValidation,
            },
          ]}
        >
          <Input
            name="user_phone"
            placeholder="Enter phone number"
            style={{ width: '100%' }}
            type="number"
          />
        </FormItem>
        <FormItem
          name="group_name"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please select user group!',
            },
          ]}
        >
          <Select placeholder="Select user group" options={userGroupList} />
        </FormItem>
        {/* {(currentUser?.user_type === 'admin' || createModalVisible.modalType !== 'edit') && ( */}
        <FormItem
          name="user_password"
          rules={[
            {
              pattern: /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
              message:
                'Password must contain 1 Upper latter, 1 Lower latter, 1 special character and min 8 digits long!',
            },
            {
              required: createModalVisible.modalType !== 'edit' ? true : false,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input type="password" placeholder="Enter password" />
        </FormItem>
        {/* )} */}
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
        {currentRow?.user_fname && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.user_fname}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.user_fname,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>

      <ConfirmModel
        data={currentRow}
        title="Confirm deleting user!"
        content="Are you sure, You want to delete this user?"
        okText="Delete"
        open={isDeleteData}
        onOk={(val: TableListItem) => handleRemove([val])}
        onCancel={handleDeleteData}
      />
    </PageContainer>
  );
};

export default TableList;
