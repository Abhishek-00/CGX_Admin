export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

declare namespace REGISTER {
  type RegisterParams = {
    user_fname: string;
    user_mname?: string;
    user_lname?: string;
    user_email: string;
    user_password: string;
    confirmPassword: string;
  };
}
