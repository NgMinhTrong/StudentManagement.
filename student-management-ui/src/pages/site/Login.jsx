import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../../api/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // URL để quay lại sau khi login thành công
  const from = location.state?.from?.pathname || '/admin';

  const onFinish = async (values) => {
    setLoading(true);
    const result = await login(values.username, values.password);
    setLoading(false);

    if (result.success) {
      message.success('Đăng nhập thành công!');
      navigate(from, { replace: true });
    } else {
      message.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-indigo-700">
      <Card
        className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden"
        variant="borderless"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LoginOutlined className="text-white text-3xl" />
          </div>
          <Title level={2} className="m-0">Student Management</Title>
          <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tên đăng nhập"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 border-none text-lg font-semibold mt-4"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

      </Card>
    </div>
  );
};

export default Login;
