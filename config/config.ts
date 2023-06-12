// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
  },
  hash: true,
  antd: {
    dark: true, // active dark theme
    // compact: true, // active compact theme
  },
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      component: './dashboard/analysis',
    },
    {
      path: '/dashboard1',
      name: 'Dashboard1',
      icon: 'dashboard',
      component: './dashboard1',
    },
    {
      path: '/emailvalidation/:token',
      name: 'emailvalidation',
      component: './user/emailValidation',
      hideInMenu: true,
      layout: false,
    },
    {
      path: '/users',
      icon: 'user',
      name: 'Users',
      component: './user/userTableList',
    },
    {
      path: '/camos',
      name: 'Camos',
      icon: 'smile',
      component: './Camos',
    },
    {
      path: '/backgrounds',
      icon: 'smile',
      name: 'Backgrounds',
      component: './Backgrounds',
    },
    {
      path: '/test-session',
      icon: 'smile',
      name: 'Test Session',
      component: './TestSession',
    },
    {
      icon: 'smile',
      name: 'Configuration',
      path: '/config',
      routes: [
        {
          path: '/config',
          redirect: '/config/user-type',
        },
        {
          path: '/config/user-type',
          name: 'User Types',
          component: './configuration/UserTypeList',
        },
        {
          path: '/config/camo-tags',
          name: 'Camo Tags',
          component: './configuration/CamoTags',
        },
      ],
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      component: '404',
    },
  ],
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn

  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
