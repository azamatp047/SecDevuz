import { useAuth } from "../../hooks/useAuth"
import { Form, Input, Button, Card } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const { loginMutation, isLoggingIn } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      await loginMutation.mutateAsync(values, {
        onSuccess: (data) => {
        // Agar backenddan token kelsa
        if (data?.access) {
          try {
            navigate("/"); // Asosiy sahifaga yo'naltirish
          } catch (err) {
            console.error("LocalStorage error:", err);
          }
        } else {
          console.log("Token topilmadi!");
        }
      },
      })
    } catch (err: any) {
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Card title="🔐 Security Developer Kirish1" className="w-[380px] shadow-lg rounded-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Iltimos foydalanuvchi nomini kiriting!" },
              { min: 5, message: "5 ta belgidan ko'p bulishi kerak!" },
              { type: "email", message: "Iltimos to'g'ri email kiriting!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Foydalanuvchi emaili"
              size="large"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Parol"
            rules={[
              { required: true, message: "Iltimos parolni kiriting!" },
              { min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parol"
              size="large"
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => {
              // Validatsiya xatoliklari borligini tekshirish
              const errors = form.getFieldsError().some(({ errors }) => errors.length > 0)
              // Barcha maydonlar to'ldirilganmi yoki yo'qmi tekshirish
              const allFieldsTouched = form.isFieldsTouched(true)
              
              return (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading || isLoggingIn}
                  block
                  size="large"
                  disabled={!allFieldsTouched || errors}
                >
                  Kirish
                </Button>
              )
            }}
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
