import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import { unAuthRoutes } from './constants/common.constants';
import { readData, removeItemValue } from './utils/storage';
import { Provider } from 'react-redux';
import { storeData } from './services/store';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';

/** loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

const checkLoginData = () => {
  if (window.location.pathname === '/exit') {
    console.log('window.location.pathname: ', window.location.pathname);
    removeItemValue('appToken');
    removeItemValue('route');
  }
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    const appToken = await readData('appToken');
    if (appToken) checkLoginData();
    try {
      const token = await readData('accessToken');
      const msg = await readData('currentUser');
      if (!token || !msg) {
        throw new Error();
      }
      return msg;
    } catch (error) {
      if (
        !unAuthRoutes.includes(location.pathname) &&
        !location.pathname.includes('emailvalidation')
      ) {
        history.push(unAuthRoutes[0]);
      }
    }
    return undefined;
  };
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }: any) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    onPageChange: () => {
      const { location } = history;
      if (
        !initialState?.currentUser &&
        !unAuthRoutes.includes(location.pathname) &&
        !location.pathname.includes('emailvalidation')
      ) {
        history.push(unAuthRoutes[0]);
      }
    },
    menuHeaderRender: undefined,
    childrenRender: (children: any, props: any) => {
      return (
        <ConfigProvider locale={enUS}>
          <Provider store={storeData}>
            {children}
            {!unAuthRoutes.some((path) => props.location?.pathname?.includes(path)) && (
              <SettingDrawer
                disableUrlParams
                enableDarkTheme
                settings={initialState?.settings}
                onSettingChange={(settings: any) => {
                  setInitialState((preInitialState: any) => ({
                    ...preInitialState,
                    settings,
                  }));
                }}
              />
            )}
          </Provider>
        </ConfigProvider>
      );
    },
    ...initialState?.settings,
  };
};
