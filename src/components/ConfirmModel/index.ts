import { useEffect } from 'react';
import { Modal } from 'antd';

export default function ConfirmModel({ open, title, content, okText, onCancel, onOk, data }: any) {
  const [modal, contextHolder] = Modal.useModal();

  const config = {
    open,
    title,
    content,
    okText: okText || 'Ok',
    onOk: () => onOk(data),
    onCancel: () => onCancel(),
  };

  useEffect(() => {
    if (open) {
      modal.confirm(config);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return contextHolder;
}
