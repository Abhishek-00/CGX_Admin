import { Select } from 'antd';
import styles from './style.less';
import type { ReactNode } from 'react';
import type { SelectProps } from 'antd';

type CustomSelectProps = SelectProps & {
  prefixIcon?: ReactNode;
};

export const CustomSelect = ({ prefixIcon, ...rest }: CustomSelectProps) => {
  return (
    <div className={styles.selectWrapper}>
      {prefixIcon && <div className={styles.prefixIconWrapper}>{prefixIcon}</div>}
      <Select {...rest} className={styles.selectInput} />
    </div>
  );
};
