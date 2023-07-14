import { useSelector } from 'react-redux';
import {
  CaretUpFilled,
  CloseOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { Button, Input, Drawer, Form, Select, message, Card, Row, Col, Modal, Tooltip } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import LazyLoad from 'react-lazyload';
import type { CAMOS, Camo, Pagination, Tag, CamoFilter, CamoImageType } from './data';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import { CustomSelect } from '@/components/CustomSelect';
import CamoAPIClient from '../../services/camosActions/index';
import ConfirmModel from '../../components/ConfirmModel';
import styles from './style.less';
import UploadBtn from './UploadBtn';
import CamoImageCompetent from './CamoImage';
import Image from '../../components/ImageComponent';
import ConfigAPIClient from '../../services/configActions';

const FormItem = Form.Item;

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const CamoList = useSelector((state: any) => state.Camo);

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [imageModalVisible, handleImageModalVisible] = useState<boolean>(false);

  const [tagsList, setTagList] = useState<{ label: string; value: string }[]>([]);
  // const [camoDataList, setCamoDataList] = useState<CAMOS.TableListItem[]>([]);
  const [camoDataImageList, setCamoDataImageList] = useState<CamoImageType[]>([]);
  const [paginationData, setPaginationData] = useState<Pagination>({});

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Camo>();
  const [selectedRowsState, setSelectedRows] = useState<CAMOS.TableListItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [itemSize, setItemSize] = useState<number>(10000);

  const [filterForm] = Form.useForm();
  const [filterParams, setFilterParams] = useState({});
  const [isDeleteData, setDeleteData] = useState<boolean>(false);
  const [isCollapse, setCollapse] = useState<boolean>(false);
  const [hideClearBtn, setHideClearBtn] = useState<boolean>(false);

  const handleAddEditModal = (camo: Camo, isOpen: boolean, isEdit: boolean) => {
    const newTags: any[] = [];
    if (camo.tag_name) {
      camo.tag_name.split(',').map((tags) => {
        tagsList.map((tag) => {
          if (tag.label === tags) newTags.push(tag.value);
        });
      });
    }

    form.setFieldsValue({
      ...camo,
      tag_name: newTags,
    });
    handleEditModalVisible(isEdit);
    setCurrentRow(camo);
    handleModalVisible(isOpen);
  };

  const handleCamoImage = (data: any) => {
    const index = CamoList.camos.findIndex(
      (ele: CAMOS.TableListItem) => ele.camo_id === data?.camo_id,
    );
    camoDataImageList[index] = data;
    setCamoDataImageList(camoDataImageList);
  };

  const handleModelImage = (data: Camo) => {
    const index = CamoList.camos.findIndex(
      (ele: CAMOS.TableListItem) => ele.camo_id === data?.camo_id,
    );
    setCurrentRow({ ...data, camo_image: camoDataImageList[index] });
    handleImageModalVisible(true);
  };

  const columns: ProColumns<CAMOS.TableListItem>[] = [
    {
      title: 'Camo Name',
      dataIndex: 'camo_name',
      sorter: (a: any, b: any) => a.camo_name.localeCompare(b.camo_name),
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
      title: 'Camo URL',
      dataIndex: 'camo_url',
      sorter: (a: any, b: any) => a.camo_url && a.camo_url.localeCompare(b.camo_url),
      ellipsis: true,
      render: (dom, entity) => {
        return (
          <a onClick={() => handleModelImage(entity)}>
            <LazyLoad>
              <CamoImageCompetent
                url={entity?.camo_url}
                alt={entity?.camo_name}
                classNameStyle={styles.camoTableImage}
                returnUrl={(data: CamoImageType) =>
                  handleCamoImage({ ...data, camo_id: entity.camo_id })
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
      sorter: (a: any, b: any) => a.created_by && a.created_by.localeCompare(b.created_by),
    },
    {
      title: 'Tags',
      dataIndex: 'tag_name',
      sorter: (a: any, b: any) => a.tag_name && a.tag_name.localeCompare(b.tag_name),
      ellipsis: true,
    },
    {
      title: 'Affiliate URL',
      dataIndex: 'affiliate_url',
      sorter: (a: any, b: any) => a.affiliate_url && a.affiliate_url.localeCompare(b.affiliate_url),
      ellipsis: true,
      render: (dom, entity) => {
        return (
          <a href={entity.affiliate_url} target="_blank" rel="noreferrer">
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      sorter: (a: any, b: any) => a.created_at && a.created_at.localeCompare(b.created_at),
      ellipsis: true,
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

  const handleFilter = (val: CamoFilter) => {
    if (val.added_by === '' || val.camoname === '' || val.tag_name === '') {
      setFilterParams({});
      setHideClearBtn(false);
    } else {
      const tag_filter: string[] = [];
      const selectedTags: any = val.tag_name;
      if (val.tag_name !== undefined) {
        selectedTags.map((tagId: number) => {
          tagsList.map((ele: any) => {
            if (ele.value === tagId) tag_filter.push(ele.label);
          });
        });
      }
      val.tag_name = `[${tag_filter.toString()}]`;
      setFilterParams(val);
      setHideClearBtn(true);
    }
  };

  const handleResetField = () => {
    filterForm.resetFields();
    setHideClearBtn(false);
    setFilterParams({});
  };

  const getCamos = async () => {
    const hide = message.loading('Loading camos data!');
    try {
      const response = await CamoAPIClient.getCamosList(
        {
          page_number: page,
          page_size: itemSize,
        },
        { params: filterParams },
      );
      if (response?.code === 200) {
        if (response.data.length) {
          setPaginationData(response.pagination);
        }
      }
      hide();
      return true;
    } catch (error) {
      hide();
      message.error('Failed to get camo data!');
      return false;
    }
  };

  const getAllCamoTags = async () => {
    try {
      const response = await ConfigAPIClient.CamoTag.getCamoTags();
      if (response.code === 200) {
        const tagList = response.data.camotags.map((tag: Tag) => {
          return {
            value: tag.tag_id,
            label: tag.tag_name,
          };
        });
        setTagList(tagList);
      }
    } catch (error) {
      message.error('Failed to get camo tags data!');
    }
  };

  useEffect(() => {
    getAllCamoTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCamos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemSize, filterParams]);

  const handleRemove = async (fields: CAMOS.TableListItem[]) => {
    const userIds: any = fields?.map((user: CAMOS.TableListItem) => user?.camo_id);
    try {
      await CamoAPIClient.removeCamos(userIds);
      message.success('Deleted camo successfully');
      getCamos();
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

  const checkCamoFileType = (_: any, value: any) => {
    const promise = Promise;
    if (editModalVisible) return promise.resolve();
    if (value && value[0] && !value[0].type.includes('png') && !value[0].type.includes('jpeg')) {
      return promise.reject('Only PNG and JPEG image is supported!');
    }
    return promise.resolve();
  };

  const copyLink = () => {
    if (currentRow && currentRow?.affiliate_url) {
      navigator.clipboard.writeText(currentRow.affiliate_url);
    }
  };

  return (
    <PageContainer>
      <Card className={styles.searchWrapperBox}>
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
              <FormItem name="camoname" className={styles.formItem}>
                <Input placeholder="Camo name" type="text" prefix={<UserOutlined />} />
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
                <Input placeholder="Added By" type="text" prefix={<UserOutlined />} />
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
              <FormItem name="tag_name" className={styles.formItem}>
                <Select
                  className={styles.filterSelect}
                  mode="multiple"
                  placeholder="Enter tags"
                  options={tagsList}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4} xl={4}>
              <div className={styles.searchButtonBox}>
                <div className={isCollapse ? styles.colHidden : ''}>
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

      <ProTable<CAMOS.TableListItem, Pagination>
        actionRef={actionRef}
        rowKey="camo_id"
        headerTitle="Camos"
        search={false}
        columns={columns}
        // dataSource={camoDataList}
        dataSource={CamoList.camos}
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
                  { camo_name: '', affiliate_url: '', camo_url: '', tag_name: undefined },
                  true,
                  false,
                );
              }}
            >
              <PlusOutlined /> Add Camo
            </Button>,
          ],
        }}
        pagination={{
          pageSize: itemSize,
          current: page,
          total: paginationData.total_items,
          showSizeChanger: true,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]} - ${range[1]} of ${total} camoes`,
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
        title={editModalVisible ? 'Edit Camo' : 'Add Camo'}
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
        onFinish={async (value) => {
          const formData = new FormData();
          formData.append('camo_name', value.camo_name);
          formData.append('affiliate_url', value.affiliate_url);
          formData.append('tags', `[${value?.tag_name.toString()}]`);
          if (!editModalVisible) {
            formData.append('camo', value.camo_url[0].originFileObj);
          } else {
            if (typeof value.camo_url !== 'string' && !(value.camo_url instanceof String)) {
              formData.append('camo_image', value.camo_url[0].originFileObj);
            }
          }
          let success;
          if (!editModalVisible) {
            success = await CamoAPIClient.createCamos(formData);
          } else {
            success = await CamoAPIClient.updateCamos(currentRow?.camo_id, formData);
          }
          if (success?.code === 400) {
            message.error(success.message);
          }
          if (success) {
            getCamos();
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        form={form}
        initialValues={{ camo_url: form.getFieldValue('camo_url') }}
      >
        <FormItem
          name="camo_name"
          rules={[
            {
              required: true,
              message: 'Please input camo name!',
            },
          ]}
        >
          <Input size="large" placeholder="Enter camo name" />
        </FormItem>
        <FormItem
          name="camo_url"
          rules={[
            {
              required: !editModalVisible,
              message: 'Please input camo file!',
            },
            {
              validator: checkCamoFileType,
            },
          ]}
          initialValue={form.getFieldValue('camo_url')}
        >
          <UploadBtn />
        </FormItem>
        <FormItem
          name="tag_name"
          rules={[
            {
              required: true,
              message: 'Please input tags!',
            },
          ]}
        >
          <Select mode="multiple" placeholder="Enter tags" options={tagsList} size="large" />
        </FormItem>
        <FormItem
          name="affiliate_url"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input affiliate url!',
            },
            // { type: 'url', message: 'Please add valid URL!' },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter affiliate url"
            readOnly={editModalVisible}
            suffix={
              editModalVisible && (
                <Tooltip title="Copy">
                  <CopyOutlined style={{ color: 'rgba(0,0,0,.45)' }} onClick={() => copyLink()} />
                </Tooltip>
              )
            }
          />
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
        {currentRow?.camo_name && (
          <ProDescriptions<CAMOS.TableListItem>
            column={1}
            title={currentRow.camo_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow.camo_name,
            }}
            columns={columns as ProDescriptionsItemProps<CAMOS.TableListItem>[]}
          />
        )}
      </Drawer>

      <Modal
        title="Camo Image"
        open={imageModalVisible}
        footer={null}
        onCancel={() => handleImageModalVisible(false)}
      >
        <Image
          url={currentRow?.camo_image}
          alt={currentRow?.camo_name}
          className={styles.camoModalImage}
        />
      </Modal>

      <ConfirmModel
        data={currentRow}
        title="Confirm deleting Camo!"
        content="Are you sure, You want to delete this camo?"
        okText="Delete"
        open={isDeleteData}
        onOk={(val: CAMOS.TableListItem) => handleRemove([val])}
        onCancel={handleDeleteData}
      />
    </PageContainer>
  );
};

export default TableList;
