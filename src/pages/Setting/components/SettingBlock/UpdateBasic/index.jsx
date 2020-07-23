import React, { useState } from 'react';
import { store } from 'ice';
import {
  Button,
  Card,
  Form,
  ResponsiveGrid,
  Avatar,
  Upload,
  Divider,
  Input,
  Message,
} from '@alifd/next';
import PageTab from '@/components/PageTab';
import SubmitBtn from '@/components/SubmitBtn';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const UpdateBasic = () => {
  const [userState, userDispatchers] = store.useModel('user');
  // const [postData, setValue] = useState({
  //   userName: '',
  //   email: '',
  //   avatar: '',
  // });

  // const formChange = (value) => {
  //   setValue(value);
  // };

  const handleSubmit = async (values, errors) => {
    if (errors) {
      console.log('errors', errors);
      Message.error('更新失败');
      return;
    }

    console.log('values:', values);
    // request(values);
  };

  return (
    <Card free>
      <Card.Content className={styles.SettingPageBlock}>
        <Form labelAlign="top" responsive>
          <Form.Item label="" colSpan={12}>
            <ResponsiveGrid gap={10}>
              <Cell colSpan={6} className={styles.avatar}>
                <Avatar shape="circle" size={64} src={userState.avatar} />
              </Cell>
              <Cell colSpan={6} className={styles.changeLogo}>
                <Form.Item>
                  <Upload name="pic">
                    <Button type="normal">更新头像</Button>
                  </Upload>
                </Form.Item>
              </Cell>
            </ResponsiveGrid>
          </Form.Item>
          <Form.Item colSpan={12}>
            <Divider />
          </Form.Item>
          <Form.Item
            label="用户名"
            hasFeedback
            minLength={2}
            maxLength={15}
            pattern={/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5_-]{1,14}$/}
            patternMessage="必须以英文字母或汉字开头，特殊字符仅允许下划线和减号"
            colSpan={12}
          >
            <Input
              defaultValue={userState.userName}
              placeholder="用户名"
              name="userName"
            />
          </Form.Item>

          <Form.Item label="邮箱" hasFeedback format="email" colSpan={12}>
            <Input
              defaultValue={userState.email}
              placeholder="邮箱"
              name="email"
            />
          </Form.Item>

          <Form.Item
            colSpan={12}
            style={{
              marginTop: 16,
            }}
          >
            <SubmitBtn
              type="primary"
              validate
              onClick={handleSubmit}
              style={{ display: 'block', margin: '0 auto' }}
            >
              更新信息
            </SubmitBtn>
          </Form.Item>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default UpdateBasic;
