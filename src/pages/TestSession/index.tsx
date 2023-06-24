import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  CaretUpFilled,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, message, Input, Drawer, Form, Select, Card, Row, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { SESSION, TableListPagination } from './data';
import type { Background } from '../Backgrounds/data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UserAPIClient from '../../services/userActions/userApi';
import TestAPIClient from '../../services/testSessionActions';
import CamoAPIClient from '../../services/camosActions';
import BackgroundAPIClient from '../../services/backgroundActions';
// import ConfirmModel from '../../components/ConfirmModel';
import styles from './style.less';
import CamoImageCompetent from '../Camos/CamoImage';
import type { Camo } from '../Camos/data';
import CreateForm from './CreateForm/CreateForm';
import ConfirmModel from '@/components/ConfirmModel';

const FormItem = Form.Item;
const { Option } = Select;

const TestSession: React.FC = () => {
  // const UserList = useSelector((state: any) => state.User);
  const { camos } = useSelector((state: any) => state.Camo);
  const { backgrounds } = useSelector((state: any) => state.Background);
  const TestSessionList = useSelector((state: any) => state.TestSession);

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<SESSION.TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<SESSION.TableListItem[]>([]);

  // const [testDataList, setTestDataList] = useState<SESSION.TableListItem[]>([]);
  const [paginationData, setPaginationData] = useState<SESSION.Pagination>({});
  const [page, setPage] = useState<number>(1);
  const [itemSize, setItemSize] = useState<number>(10);

  const [filterForm] = Form.useForm();
  const [filterParams, setFilterParams] = useState({});
  const [isCollapse, setCollapse] = useState<boolean>(false);
  const [isDeleteData, setDeleteData] = useState<boolean>(false);
  const [hideClearBtn, setHideClearBtn] = useState<boolean>(false);

  const columns: ProColumns<SESSION.TableListItem>[] = [
    {
      title: 'Test Name',
      dataIndex: 'test_name',
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
      title: 'Background',
      dataIndex: 'background_name',
      sorter: true,
    },
    {
      title: 'Camos',
      dataIndex: 'camo_name',
      sorter: true,
    },
    {
      title: 'User',
      dataIndex: 'users',
      sorter: true,
    },
    // {
    //   title: 'User Group',
    //   dataIndex: 'user_group',
    //   sorter: true,
    // },
    // {
    //   title: 'Test Mode',
    //   dataIndex: 'test_mode',
    //   sorter: true,
    // },
    {
      title: 'Is BW',
      dataIndex: 'is_bw',
      sorter: true,
      render: (dom) => (dom === 0 ? 'No' : 'Yes'),
    },
    {
      title: 'Creation date',
      dataIndex: 'creation_date',
      sorter: true,
      render: (dom, data) => moment(data.creation_date).format('L'),
    },
    {
      title: 'End date',
      dataIndex: 'session_end_date',
      sorter: true,
      render: (dom, data) => moment(data.session_end_date).format('L'),
    },
    // {
    //   title: 'Game Round',
    //   dataIndex: 'game_round',
    //   sorter: true,
    // },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleEditModalVisible(true);
            setCurrentRow(record);
            handleModalVisible(true);
          }}
        >
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

  const getTestSessions = async () => {
    const hide = message.loading('Loading test session data!');
    try {
      const response = await TestAPIClient.getTestSessionList(
        {
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
      message.error('Failed to get test session data!');
      return false;
    }
  };

  const getBackgroundsList = (pageNumber: number, size = 10, value: string) => {
    BackgroundAPIClient.getBackgroundsList(
      {
        page_number: pageNumber,
        page_size: size,
      },
      {
        params: {
          background_name: value,
        },
      },
    );
  };

  const getCamoList = (pageNumber: number, size = 10, value: string) => {
    CamoAPIClient.getCamosList(
      {
        page_number: pageNumber,
        page_size: size,
      },
      {
        params: {
          camoname: value,
        },
      },
    );
  };
  const getUserList = (pageNumber: number, size = 20, value: string) => {
    UserAPIClient.getUsers(
      {
        page_number: pageNumber,
        page_size: size,
      },
      {
        params: {
          user_fname: value,
        },
      },
    );
  };

  useEffect(() => {
    getBackgroundsList(1, 20, '');
    getCamoList(1, 20, '');
    getUserList(1, 20, '');
  }, []);

  useEffect(() => {
    getTestSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemSize, filterParams]);

  const handleFilter = (val: SESSION.filter) => {
    if (val.test_name === '' || val.background_name === '' || val.camo_name === '') {
      setFilterParams({});
      setHideClearBtn(false);
    } else {
      val.camo_name = `[${val?.camo_name?.toString()}]`;
      val.background_name = `[${val?.background_name?.toString()}]`;
      setFilterParams(val);
      setHideClearBtn(true);
    }
  };

  const handleRemoveTestSession = async (fields: SESSION.TableListItem[]) => {
    const sessionIds: any = fields?.map((test: SESSION.TableListItem) => test.test_id);
    try {
      await TestAPIClient.removeTestSession(sessionIds);
      message.success('Deleted test session successfully');
      getTestSessions();
      return true;
    } catch (error) {
      message.error('Failed to delete, please try again!');
      return false;
    }
  };

  const handleResetField = () => {
    filterForm.resetFields();
    setHideClearBtn(false);
    setFilterParams({});
  };

  const handleSearchBack = (value: string) => {
    getBackgroundsList(1, 10, value);
  };

  const handleSearchCamo = async (value: string) => {
    getCamoList(1, 10, value);
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
                <Input placeholder="Test session name" type="text" />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="camo_name" className={styles.formItem}>
                <Select placeholder="Select camo" onSearch={handleSearchCamo} mode="multiple">
                  {camos.map((camo: Camo) => (
                    <Option value={camo.camo_name} key={camo.camo_id?.toString()}>
                      <CamoImageCompetent
                        url={camo?.camo_url}
                        alt={camo?.camo_name}
                        classNameStyle={styles.camoTableImage}
                        isDropdown
                      />{' '}
                      {camo.camo_name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4} className={isCollapse && styles.colHidden}>
              <FormItem name="background_name" className={styles.formItem}>
                <Select placeholder="Select background" onSearch={handleSearchBack} mode="multiple">
                  {backgrounds.map((background: Background) => (
                    <Option
                      value={background.background_name}
                      key={background.background_id?.toString()}
                    >
                      <CamoImageCompetent
                        url={background?.background_url}
                        alt={background?.background_name}
                        classNameStyle={styles.camoTableImage}
                        isDropdown
                      />{' '}
                      {background.background_name}
                    </Option>
                  ))}
                </Select>
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

      <ProTable<SESSION.TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="test_id"
        headerTitle="Test Sessions"
        search={false}
        options={false}
        toolbar={{
          actions: [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleModalVisible(true);
                handleEditModalVisible(false);
              }}
            >
              <PlusOutlined /> Add Test Session
            </Button>,
          ],
        }}
        columns={columns}
        dataSource={TestSessionList.testsessions}
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
            `${range[0]} - ${range[1]} of ${total} sessions`,
          onChange: (pageNumber: number) => setPage(Number(pageNumber)),
          onShowSizeChange: (current, size) => setItemSize(size),
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
              test sessions
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemoveTestSession(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Bulk deletion
          </Button>
        </FooterToolbar>
      )}
      {/* Data review drawer */}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {currentRow?.test_name && (
          <ProDescriptions<SESSION.TableListItem>
            column={2}
            title={currentRow.test_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow.test_name,
            }}
            columns={columns as ProDescriptionsItemProps<SESSION.TableListItem>[]}
          />
        )}
      </Drawer>
      {/* data add and update model */}
      <CreateForm
        modalVisible={createModalVisible}
        currentRow={currentRow}
        onCancel={(val: boolean) => handleModalVisible(val)}
        isEdit={editModalVisible}
        getList={() => getTestSessions()}
        getBgData={() => getBackgroundsList(1, 20, '')}
        getCamoData={() => getBackgroundsList(1, 20, '')}
      />
      {/* data add update drawer */}

      <ConfirmModel
        data={currentRow}
        title="Confirm deleting test sessions!"
        content="Are you sure, You want to delete this test session?"
        okText="Delete"
        open={isDeleteData}
        onOk={(val: SESSION.TableListItem) => handleRemoveTestSession([val])}
        onCancel={() => {
          setDeleteData(!isDeleteData);
          setCurrentRow(undefined);
        }}
      />
    </PageContainer>
  );
};

export default TestSession;
