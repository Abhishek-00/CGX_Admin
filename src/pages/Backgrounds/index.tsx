import {
  CaretUpFilled,
  CloseOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Drawer, Form, Select, message, Modal, Card, Row, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { Background, BackgroundImageType, Pagination } from './data';
import LazyLoad from 'react-lazyload';
import BackgroundImageCompetent from './BackgroundImage';
import BackgroundAPIClient from '../../services/backgroundActions';
import Image from '../../components/ImageComponent';
import ConfirmModel from '@/components/ConfirmModel';
import styles from './style.less';
import UploadBtn from './UploadBtn';

const FormItem = Form.Item;

const TableList: React.FC = () => {
  const [form] = Form.useForm();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [imageModalVisible, handleImageModalVisible] = useState<boolean>(false);

  const [backgroundDataList, setBackgroundDataList] = useState<Background[]>([]);
  const [backgroundImageList, setBackgroundImageList] = useState<BackgroundImageType[]>([]);
  const [paginationData, setPaginationData] = useState<Pagination>({});

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Background>();
  const [selectedRowsState, setSelectedRows] = useState<Background[]>([]);
  const [page, setPage] = useState<number>(1);
  const [itemSize, setItemSize] = useState<number>(10);

  const [filterForm] = Form.useForm();
  const [filterParams, setFilterParams] = useState({});
  const [isDeleteData, setDeleteData] = useState<boolean>(false);
  const [isCollapse, setCollapse] = useState<boolean>(false);
  const [hideClearBtn, setHideClearBtn] = useState<boolean>(false);

  const handleModelImage = (data: Background) => {
    const index = backgroundDataList.findIndex((ele) => ele.background_id === data?.background_id);
    setCurrentRow({ ...data, background_image: backgroundImageList[index] });
    handleImageModalVisible(true);
  };

  const handleBackgroundImage = (data: any) => {
    const index = backgroundDataList.findIndex((ele) => ele.background_id === data?.background_id);
    backgroundImageList[index] = data;
    setBackgroundImageList(backgroundImageList);
  };

  const handleAddEditModal = (background: Background, isOpen: boolean, isEdit: boolean) => {
    form.setFieldsValue({ ...background });
    handleEditModalVisible(isEdit);
    setCurrentRow(background);
    handleModalVisible(isOpen);
  };

  const checkBackgroundFileType = (_: any, value: any) => {
    const promise = Promise;
    if (editModalVisible) return promise.resolve();
    if (value && value[0] && !value[0].type.includes('png') && !value[0].type.includes('jpeg')) {
      return promise.reject('Only PNG and JPEG image is supported!');
    }
    return promise.resolve();
  };

  const columns: ProColumns<Background>[] = [
    {
      title: 'Background Name',
      dataIndex: 'background_name',
      sorter: (a: any, b: any) => a.background_name.localeCompare(b.background_name),
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
      title: 'Background URL',
      dataIndex: 'background_url',
      render: (dom, entity) => {
        return (
          <a onClick={() => handleModelImage(entity)}>
            <LazyLoad>
              <BackgroundImageCompetent
                url={entity?.background_url}
                alt={entity?.background_name}
                className={styles.camoTableImage}
                returnUrl={(data: BackgroundImageType) =>
                  handleBackgroundImage({ ...data, background_id: entity.background_id })
                }
              />
            </LazyLoad>
          </a>
        );
      },
    },
    {
      title: 'Uploaded By',
      dataIndex: 'created_by',
      sorter: (a: any, b: any) => a.created_by.localeCompare(b.created_by),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: (a: any, b: any) => a.location.localeCompare(b.location), //a.location && a.location.localeCompare(b.location)
    },
    {
      title: 'Weather',
      dataIndex: 'weather',
      sorter: (a: any, b: any) => a.weather.localeCompare(b.weather),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
    },
    {
      title: 'Metadata',
      dataIndex: 'metadata',
      sorter: (a: any, b: any) => a.metadata && a.metadata.localeCompare(b.metadata),
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            form.resetFields();
            handleAddEditModal(record, true, true);
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

  const getBackgroundList = async () => {
    const hide = message.loading('Loading background data!');
    try {
      const response = await BackgroundAPIClient.getBackgroundsList(
        {
          page_number: page,
          page_size: itemSize,
        },
        { params: filterParams },
      );
      console.log(filterParams);
      console.log(response?.code);
      setBackgroundDataList(response.data);
      setPaginationData(response.pagination);
      hide();
      return true;
    } catch (error) {
      hide();
      message.error('Failed to get camo data!');
      return false;
    }
  };

  const handleRemoveBackground = async (fields: Background[]) => {
    const backgroundIds: any = fields?.map((background: Background) => background.background_id);

    try {
      await BackgroundAPIClient.removeBackgrounds(backgroundIds);
      message.success('Delete background successfully!');
      getBackgroundList();
      return true;
    } catch (error) {
      message.error('Failed to delete, please try again!');
      return false;
    }
  };

  const handleFilter = (val: Background) => {
    if (
      val.added_by === '' &&
      val.background_name === '' &&
      val.location === '' &&
      val.weather === '' &&
      val.category === ''
    ) {
      filterForm.resetFields();
      setFilterParams({});
      setHideClearBtn(false);
    }

    if (
      val.added_by === '' ||
      val.background_name === '' ||
      val.location === '' ||
      val.weather === '' ||
      val.category === ''
    ) {
      console.log('values');
      console.log(val);
      // filterForm.resetFields();
      setFilterParams({});
      setHideClearBtn(false);
    } else {
      setFilterParams(val);
      setHideClearBtn(true);
    }
  };

  useEffect(() => {
    getBackgroundList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemSize, filterParams]);

  return (
    <PageContainer>
      <Card className={styles.filterWrapperBox}>
        <Form
          onFinish={(values) => handleFilter(values)}
          onChange={() => setHideClearBtn(true)}
          autoComplete="off"
          form={filterForm}
        >
          <Row gutter={[16, 24]}>
            <Col
              xs={24}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              className={isCollapse ? styles.colHidden : ''}
            >
              <FormItem name="background_name" className={styles.formItem}>
                <Input placeholder="Background name" type="text" allowClear />
              </FormItem>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              className={isCollapse ? styles.colHidden : ''}
            >
              <FormItem name="added_by" className={styles.formItem}>
                <Input placeholder="Added By" type="text" allowClear />
              </FormItem>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              className={isCollapse ? styles.colHidden : ''}
            >
              <FormItem name="location" className={styles.formItem}>
                <Input placeholder="Location" type="text" allowClear />
              </FormItem>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              className={isCollapse ? styles.colHidden : ''}
            >
              <FormItem name="weather" className={styles.formItem}>
                <Input placeholder="Weather" type="text" allowClear />
              </FormItem>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              className={isCollapse ? styles.colHidden : ''}
            >
              <FormItem name="category" className={styles.formItem}>
                <Input placeholder="Category" type="text" allowClear />
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
                      onClick={() => {
                        filterForm.resetFields();
                        setHideClearBtn(false);
                        setFilterParams({});
                      }}
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

      <ProTable<Background, Pagination>
        actionRef={actionRef}
        rowKey="background_id"
        headerTitle="Backgrounds"
        search={false}
        columns={columns}
        dataSource={backgroundDataList}
        options={false}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolbar={{
          actions: [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                form.resetFields();
                handleAddEditModal(
                  {
                    background_name: '',
                    background_url: '',
                    location: '',
                    weather: '',
                    metadata: '',
                    category: '',
                  },
                  true,
                  false,
                );
              }}
            >
              <PlusOutlined /> Add Background
            </Button>,
          ],
        }}
        pagination={{
          pageSize: itemSize,
          current: page,
          total: paginationData.total_items,
          showSizeChanger: true,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]} - ${range[1]} of ${total} backgrounds`,
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
              item
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleRemoveBackground(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Bulk deletion
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title={editModalVisible ? 'Edit Background' : 'Add Background'}
        width="450px"
        visible={createModalVisible}
        onVisibleChange={(visible: boolean) => {
          handleModalVisible(visible);
        }}
        submitter={{
          searchConfig: {
            resetText: 'Cancel',
            submitText: editModalVisible ? 'Update' : 'Submit',
          },
        }}
        form={form}
        initialValues={{ background_url: form.getFieldValue('background_url') }}
        onFinish={async (value) => {
          const formData = new FormData();
          formData.append('background_name', value.background_name);
          formData.append('location', value.location);
          formData.append('weather', value.weather);
          formData.append('category', value.category);
          formData.append('metadata', value.metadata || '');
          if (
            !editModalVisible ||
            (typeof value.background_url !== 'string' && !(value.background_url instanceof String))
          ) {
            formData.append('background_file', value.background_url[0].originFileObj);
          }
          let success;
          if (!editModalVisible) {
            success = await BackgroundAPIClient.createBackgrounds(formData);
          } else {
            success = await BackgroundAPIClient.updateBackgrounds(
              currentRow?.background_id,
              formData,
            );
          }
          if (success?.code === 400) {
            message.error(success.message);
          }
          if (success) {
            handleModalVisible(false);
            getBackgroundList();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <FormItem
          name="background_name"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input background name!',
            },
          ]}
        >
          <Input size="large" placeholder="Enter background name" />
        </FormItem>
        <FormItem
          name="background_url"
          rules={[
            {
              required: !editModalVisible,
              message: 'Please input background file!',
            },
            {
              validator: checkBackgroundFileType,
            },
          ]}
          initialValue={form.getFieldValue('background_url')}
        >
          <UploadBtn />
        </FormItem>
        <FormItem
          name="location"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input location!',
            },
          ]}
        >
          <Input size="large" placeholder="Enter location" />
        </FormItem>
        <FormItem
          name="weather"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input weather!',
            },
          ]}
        >
          <Input size="large" placeholder="Enter weather" />
        </FormItem>
        <FormItem
          name="category"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input category!',
            },
          ]}
        >
          <Input size="large" placeholder="Enter category" />
        </FormItem>
        <FormItem name="metadata" validateTrigger="onBlur">
          <Input size="large" placeholder="Enter metadata" />
        </FormItem>
      </ModalForm>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.background_name && (
          <ProDescriptions<Background>
            column={1}
            title={currentRow.background_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow.background_name,
            }}
            columns={columns as ProDescriptionsItemProps<Background>[]}
          />
        )}
      </Drawer>

      <Modal
        title={`${currentRow?.background_name} background image`}
        open={imageModalVisible}
        footer={null}
        onCancel={() => handleImageModalVisible(false)}
      >
        <Image
          url={currentRow?.background_image}
          alt={currentRow?.background_name}
          className={styles.camoModalImage}
        />
      </Modal>

      <ConfirmModel
        data={currentRow}
        title="Confirm deleting background!"
        content="Are you sure, You want to delete this background?"
        okText="Delete"
        open={isDeleteData}
        onOk={(val: Background) => handleRemoveBackground([val])}
        onCancel={() => {
          setDeleteData(!isDeleteData);
          setCurrentRow(undefined);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
