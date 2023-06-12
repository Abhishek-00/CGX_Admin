import { Spin, message } from 'antd';
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import styles from './index.less';
import { clearStorage, saveData } from '@/utils/storage';
import APIClient from '../../../services/authActions/index';

const Login: React.FC = () => {
  const history = useHistory();
  const { token }: any = useParams();

  const getUser = async () => {
    APIClient.Login.user({
      token: token,
    })
      .then((data) => {
        if (data.code === 200) {
          saveData('currentUser', data?.data[0]);
          saveData('accessToken', token);
          message.success('Email verified successfully!');
          window.location.href = '/dashboard';
        }
      })
      .catch((error) => {
        message.error('Email verification failed!');
        history.push('/user/login');
      });
  };

  const getEmailVerification = () => {
    APIClient.Login.emailVarification({
      token: token,
    })
      .then((data) => {
        if (data.code === 200) {
          getUser();
        }
      })
      .catch((error) => {
        message.error('Email verification failed!');
        history.push('/user/login');
      });
  };

  useEffect(() => {
    clearStorage();
    getEmailVerification();
  }, []);

  return (
    <div className={styles.emailValidationWrapper}>
      <Spin />
    </div>
  );
};

export default Login;
