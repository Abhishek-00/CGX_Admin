import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Button, Divider, Checkbox, message } from 'antd';
import { ConfigProvider } from 'antd';
import { Space, Select } from 'antd';


import { Column } from '@ant-design/charts';

import { filtersSelectCard, filtersCheckbox, stats, graphData } from './dummyData/api';

import CamoAPIClient from '../../services/camosActions/index';
import styles from '../../global.less';

import imageUrl1 from './assets/1.png';
import imageUrl2 from './assets/2.png';
import imageUrl3 from './assets/3.png';
import imageUrl4 from './assets/4.png';


const FormItem = Form.Item;



// for select input
const { Option } = Select;

const Analytics1: React.FC = () => {
    const [camouflage, setCamouflage] = useState<{ label: string; value: string }[]>([]);
    const [environment, setEnvironment] = useState<{ label: string; value: string }[]>([]);
    const [usernames, setUsernames] = useState<{ label: string; value: string }[]>([]);

    const camos = useSelector((state: any) => state.Camo.camos);
    const backgrounds = useSelector((state: any) => state.Background.backgrounds);
    const users = useSelector((state: any) => state.User.users);
    const state = useSelector((state: any) => state);

    // const select = useSelector((state: any) => state);
    console.log(state);

    const getAllBackgroundName = async () => {
        try {
            if (backgrounds != null) {
                const backgroundName = backgrounds.map((env: any) => {
                    return {
                        value: env.background_name,
                        label: env.background_name,
                    };
                });
                filtersSelectCard[1].options = backgroundName;
                setEnvironment(backgroundName);
            }
        } catch (error) {
            message.error('Failed to get environment data!');
        }
    };

    const getAllCamoName = async () => {
        try {
            if (camos != null) {
                const camoName = camos.map((camo: any) => {
                    return {
                        value: camo.camo_name,
                        label: camo.camo_name,
                    };
                });
                filtersSelectCard[0].options = camoName;
                setCamouflage(camoName);
            }
        } catch (error) {
            message.error('Failed to get camo name data!');
        }
    };
    console.log(filtersSelectCard);

    const getAllUserNames = async () => {
        try {
            if (users != null) {
                const userName = users.map((user: any) => {
                    return {
                        value: user.user_fname + ' ' + user.user_lname,
                        label: user.user_fname + ' ' + user.user_lname,
                    };
                });
                filtersSelectCard[3].options = userName;
                setEnvironment(userName);
            }
        } catch (error) {
            message.error('Failed to get environment data!');
        }
    };

    useEffect(() => {
        getAllCamoName();
        getAllBackgroundName();
        getAllUserNames();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    graphData[0].titleBG = imageUrl1;
    graphData[1].titleBG = imageUrl2;
    graphData[2].titleBG = imageUrl3;
    graphData[3].titleBG = imageUrl4;

    const getCamos = async () => {
        const hide = message.loading('Loading camos data!');
        try {
            const response = await CamoAPIClient.getCamosList(
                {
                    page_number: 1,
                    page_size: 10000,
                },
                // { params: filterParams },
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

    return (
        <>
            <ConfigProvider>
                <div className={styles.siteCardWrapper}>
                    <div className={styles.filterContainer}>
                        <Form
                            // onFinish={(values) => handleFilter(values)}
                            // onChange={() => setHideClearBtn(true)}
                            autoComplete="off"
                        // form={filterForm}
                        >
                            <Row gutter={[60, 24]}>
                                <div className={styles.sideTitle}>FILTERS</div>
                                {filtersSelectCard.map((items) => (
                                    <Col span={12} key={items.key}>
                                        <div className={styles.title}>{items.title}</div>
                                        <Card
                                            hoverable={true}
                                            bordered={false}
                                            size="small"
                                            className={styles.selectCol}
                                        >
                                            <Space.Compact block={true} size="small">
                                                {/* <Select className='select-input' defaultValue={items.selectDefault} bordered={false} style={{ width: '100%' }} size={'small'}>

                                                        {items.options.map((item, index) => (
                                                            <Option key={index} value={item.value}>{item.value}</Option>
                                                        ))}

                                                    </Select> */}
                                                <FormItem name={items.title} className={styles.formItem}>
                                                    <Select
                                                        size={'small'}
                                                        bordered={false}
                                                        className={styles.selectInput}
                                                        style={{ width: '100%' }}
                                                        showArrow
                                                        mode="multiple"
                                                        maxTagCount={1}
                                                        allowClear
                                                        placeholder={items.title}
                                                        // defaultValue={['gold', 'cyan']}
                                                        options={items.options}
                                                    />
                                                </FormItem>
                                            </Space.Compact>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Form>

                        <Divider type="vertical" plain={false} />

                        <Card className={styles.filtersSelectCard} bordered={false}>
                            <Row gutter={18} className={styles.filtersSelectCardChild}>
                                {filtersCheckbox.map((items) => (
                                    <Col span={6} key={items.key}>
                                        {/* <Checkbox>{items.title}</Checkbox> */}
                                        {/* <label className="checkbox-btn">
                                            <label htmlFor="checkbox">{items.title}</label>
                                            <input id="checkbox" type="checkbox" />
                                            <span className="checkmark1 check-box"> </span>
                                        </label> */}
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </div>

                    <div className={styles.divider}> </div>

                    <div className={styles.statusContainer}>
                        <Row gutter={18}>
                            <div className={styles.sideTitle1}>STATS</div>

                            {stats.map((items) => (
                                <Col span={6} key={items.key}>
                                    <Card hoverable={true} bordered={false} size="small" className={styles.statsCard}>
                                        <Space.Compact block={false} size="small">
                                            <div className={styles.stat}>
                                                <div className={styles.statusCardTitle}>
                                                    <span>{items.title}</span>
                                                </div>
                                                {/* <Card title="TOTAL TESTS" bordered={false} className='stats-card' size="small" > */}
                                                <div className={styles.statsData}>{items.data}</div>
                                                {/* </Card> */}
                                            </div>
                                        </Space.Compact>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className={styles.divider}> </div>

                    <div className={styles.graphContainer}>
                        <Row gutter={18}>
                            <div className={styles.sideTitle2}>GRAPH</div>

                            {graphData.map((items) => (
                                <Col span={6} key={items.key}>
                                    <Card hoverable={true} bordered={false} size="small" className={styles.chartCard}>
                                        <Space.Compact block={false} size="small">
                                            <div className={styles.chart} style={{ color: 'black' }}>
                                                <div
                                                    className={`${styles.chartTitle}`}
                                                    style={{ backgroundImage: `url(${items.titleBG})` }}
                                                >
                                                    <span>{items.title}</span>
                                                </div>
                                                <div className={styles.ChartData}>
                                                    <div className={styles.chartContainer}>
                                                        <div className={styles.chartWrapper}>
                                                            <DashboardChart chartData={items.chartData} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Space.Compact>
                                    </Card>
                                </Col>

                                // <Col span={6} key={items.key}>
                                //     <Card title={items.title} bordered={false} size="small" className='chart-cart'>
                                //         <div className="chart-container">
                                //             <div className="chart-wrapper">
                                //                 <DashboardChart chartData={items.chartData} />
                                //             </div>
                                //         </div>
                                //     </Card>
                                // </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </ConfigProvider>
        </>
    );
};

function DashboardChart({ chartData }: any) {
    // const data = chartData.
    // const data = [
    //     {
    //         type: 'DESERT',
    //         sales: 2,
    //     },
    //     {
    //         type: 'JUNGLE',
    //         sales: 1.4,
    //     },
    //     {
    //         type: 'URBAN',
    //         sales: 3.5,
    //     },
    //     {
    //         type: 'SNOW',
    //         sales: 2.5,
    //     },
    //     {
    //         type: 'WOODLAND',
    //         sales: 1,
    //     },
    // ]

    const config = {
        description: {
            visible: true,
            text: 'Avg: 5.42s  Rank: 12  Total: 599',
        },
        padding: 20, // Changed the value of padding to 5
        forceFit: true,
        data: chartData,
        xField: 'type',
        yField: 'sales',

        meta: {
            type: { alias: 'Map' },
            sales: { alias: 'Number' },
        },
        label: {
            visible: true,
            position: 'bottom',
        },
        colorField: 'type',
        color: ['#737073', '#516763', '#5b5e71', '#806b85', '#8c708d'],
        xAxis: {
            label: {
                autoRotate: false, // Enable automatic rotation of x-axis labels
            },
        },
        // backgroundColor: 'transparent',
        tickMargin: 20,
    };
    return <Column {...config} />;
}

export default Analytics1;
