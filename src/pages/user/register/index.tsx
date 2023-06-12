import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Form, Button, Input, message } from 'antd';
import { FormattedMessage, Link, history } from 'umi';
import type { REGISTER } from './register';
import APIClient from '../../../services/authActions';
import styles from './index.less';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { readData, saveData } from '../../../utils/storage';

const FormItem = Form.Item;

const Register: FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const verifyUserLogin = async () => {
    const getUserToken = await readData('accessToken');
    if (getUserToken) history.push('/dashboard');
  };

  useEffect(() => {
    verifyUserLogin();
  }, []);

  const onFinish = async (values: REGISTER.RegisterParams) => {
    setSubmitting(true);
    const registerResponse = await APIClient.SignUp.register({
      user_fname: values.user_fname,
      user_email: values.user_email.toLowerCase(),
      user_password: values.user_password,
      // user_mname: values.user_mname,
      // user_lname: values.user_lname,
    });
    if (registerResponse.code === 200) {
      message.success('User successfully Registered!');
      setSubmitting(false);
      if (!history) return;
      history.push('/user/login');
      return;
    } else if (registerResponse.code === 400) {
      message.error(registerResponse.message);
      setSubmitting(false);
    }
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('user_password')) {
      return promise.reject('Passwords do not match!');
    }
    return promise.resolve();
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.registerHeader}>
            <h3 className={styles.title}>
              <FormattedMessage id="menu.register" defaultMessage="Register" />
            </h3>
            <p>
              <FormattedMessage
                id="pages.register.title"
                defaultMessage="Create user to access admin portal"
              />
            </p>
          </div>
          <Form form={form} name="UserRegister" onFinish={onFinish}>
            <FormItem
              name="user_fname"
              rules={[
                {
                  required: true,
                  message: 'Please input your first name!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter first name" prefix={<UserOutlined />} />
            </FormItem>
            {/* <FormItem
              name="user_mname"
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  message: 'Please input your middle name!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter middle name" prefix={<UserOutlined />} />
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
              <Input size="large" placeholder="Enter last name" prefix={<UserOutlined />} />
            </FormItem> */}
            <FormItem
              name="user_email"
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
              <Input size="large" placeholder="Enter email" prefix={<MailOutlined />} />
            </FormItem>
            <FormItem
              name="user_password"
              rules={[
                {
                  pattern: /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                  message:
                    'Password must contain 1 Upper latter, 1 Lower latter, 1 special character and min 8 digits long!',
                },
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input
                size="large"
                type="password"
                placeholder="Enter password"
                prefix={<LockOutlined />}
              />
            </FormItem>
            <FormItem
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your confirm password!',
                },
                {
                  validator: checkConfirm,
                },
              ]}
            >
              <Input
                size="large"
                type="password"
                placeholder="Enter confirm password"
                prefix={<LockOutlined />}
              />
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="menu.register" description="Register" />
              </Button>
              <Link className={styles.login} to="/user/login">
                <FormattedMessage id="menu.login" description="Login" />
              </Link>
            </FormItem>
          </Form>
        </div>
      </div>
    </>
  );
};
export default Register;
