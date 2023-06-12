import React, { useEffect, useState } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useModel, Link, useIntl, FormattedMessage, history } from 'umi';
import APIClient from '../../../services/authActions/index';
import { saveData, readData } from '../../../utils/storage';
import { gameUrl } from '../../../constants/common.constants';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const intl = useIntl();
  const [loginFormState] = useState<LOGIN.LoginParams>({
    email: '',
    password: '',
    autoLogin: true,
  });
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const verifyUserLogin = async () => {
    const getUserToken = await readData('accessToken');
    if (getUserToken) history.push('/dashboard');
  };

  const checkGameUser = async () => {
    const token = await readData('appToken');
    if (token && token.length) {
      window.location.href = `${gameUrl}/?token=${token}&session=`;
    }
  };

  useEffect(() => {
    checkGameUser();
    verifyUserLogin();
  }, []);

  const handleSubmit = async (values: LOGIN.LoginParams) => {
    try {
      const response = await APIClient.Login.login({
        user_email: values.email.toLowerCase(),
        user_password: values.password,
      });
      if (response.code === 200 && response.page === '/dashboard') {
        saveData('currentUser', response?.data[0]);
        saveData('accessToken', response?.Authorization?.replace('Bearer ', ''));
        const defaultLoginSuccessMessage = 'Login successful!';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else if (response.code === 200 && response.page === '/game') {
        // application configuration
        saveData('appToken', response?.Authorization?.replace('Bearer ', ''));
        saveData('route', '/app');
        window.location.href = `${gameUrl}?token=${response?.Authorization?.replace(
          'Bearer ',
          '',
        )}&session=`;
      } else if (response.code === 400) {
        message.error(response.message);
      }
      if (response) setUserLoginState(response);
    } catch (error) {
      message.error('Login failed, please try again!');
    }
  };

  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title={intl.formatMessage({ id: 'pages.login.heading', defaultMessage: 'Login' })}
          subTitle={intl.formatMessage({
            id: 'pages.login.title',
            defaultMessage: 'Enter your details to login',
          })}
          initialValues={loginFormState}
          submitter={{
            searchConfig: {
              submitText: 'Login',
            },
          }}
          onFinish={async (values: LOGIN.LoginParams) => {
            await handleSubmit(values);
          }}
          actions={
            <div className={styles.registerLink}>
              <Link to="/user/register">
                <FormattedMessage id="page.register.heading" defaultMessage="Register" />
              </Link>
            </div>
          }
        >
          {status === 'Fail' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: 'Incorrect email/password',
              })}
            />
          )}
          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              validateTrigger="onBlur"
              placeholder="Enter email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              validateTrigger="onBlur"
              placeholder="Enter password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            />
          </>
          <div className={styles.rememberMe}>
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="Remember me" />
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
