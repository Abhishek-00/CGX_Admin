import { Chart, Interval, Tooltip, getTheme } from 'bizcharts';

// export const data = [
//     { year: '1951 年', sales: 0 },
//     { year: '1952 年', sales: 52 },
//     { year: '1956 年', sales: 61 },
//     { year: '1957 年', sales: 45 },
//     { year: '1958 年', sales: 48 },
//     { year: '1959 年', sales: 38 },
//     { year: '1960 年', sales: 38 },
//     { year: '1962 年', sales: 38 },
// ];
const data = [
  {
    type: '家具家电',
    sales: 38,
  },
  {
    type: '粮油副食',
    sales: 52,
  },
  {
    type: '生鲜水果',
    sales: 61,
  },
  {
    type: '美容洗护',
    sales: 145,
  },
  {
    type: '母婴用品',
    sales: 48,
  },
  {
    type: '进口食品',
    sales: 38,
  },
  {
    type: '食品饮料',
    sales: 38,
  },
  {
    type: '家庭清洁',
    sales: 38,
  },
];
export const config = {
  title: {
    visible: true,
    text: '基础柱状图-图形标签位置',
  },
  description: {
    visible: true,
    text: '基础柱状图的图形标签位置可以指定为top-柱形上部\uFF0Cmiddle-柱形中心\uFF0Cbottom-柱形底部\u3002',
  },
  forceFit: true,
  data,
  padding: 'auto',
  xField: 'type',
  yField: 'sales',
  meta: {
    type: { alias: '类别' },
    sales: { alias: '销售额(万)' },
  },
  label: {
    visible: true,
    position: 'middle',
  },
};

const BasicHistogram = () => {
  return (
    <Chart height={300} autoFit data={data}>
      <Interval
        position="year*Rank"
        style={{
          lineWidth: 4,
          fill: '#66636a',
          fotnSize: 13,
          color: '#ffffff',
        }}
      />
      <Tooltip shared />
    </Chart>
  );
};

export default BasicHistogram;
