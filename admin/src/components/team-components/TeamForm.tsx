import { useEffect } from "react"
import { Form, Input, Button, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useNavigate, useParams } from "react-router-dom"
import { useTeamMemberMutations, useTeamMember } from "../../hooks/useTeam"
import toast from "react-hot-toast"

const TeamForm = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const numberId = String(id)
  const { data: memberData } = useTeamMember(numberId)
  const { create, update } = useTeamMemberMutations()

  useEffect(() => {
    if (isEdit && memberData) {
      form.setFieldsValue({
        full_name: memberData.full_name,
        email: memberData.email,
        role_uz: memberData.role_uz,
        role_ru: memberData.role_ru,
        role_en: memberData.role_en,
        description_uz: memberData.description_uz,
        description_ru: memberData.description_ru,
        description_en: memberData.description_en,
        linked_in_link: memberData.linked_in_link,
        telegram_username: memberData.telegram_username,
      })
    }
  }, [isEdit, memberData, form])

  const onFinish = async (values: any) => {
  try {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (key === "image" && Array.isArray(value) && value[0]?.originFileObj) {
        formData.append("image", value[0].originFileObj)
      } else if (typeof value === "string" || value instanceof Blob) {
        formData.append(key, value)
      }
    })

    if (isEdit && id) {
      await update.mutateAsync({ id, data: formData })
      toast.success("Team member updated successfully!")
    } else {
      await create.mutateAsync(formData)
      toast.success("Team member created successfully!")
    }

    navigate("/team/admin")
  } catch (error) {
    console.error(error)
    toast.error("Failed to save team member!")
  }
}




  return (
    <div className="p-4 max-w-3xl mx-auto rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Team Member" : "Add New Team Member"}
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="full_name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role_uz"
          label="Role (UZ)"
          rules={[{ required: true, message: "Please enter role in Uzbek" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role_ru"
          label="Role (RU)"
          rules={[{ required: true, message: "Please enter role in Russian" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role_en"
          label="Role (EN)"
          rules={[{ required: true, message: "Please enter role in English" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description_uz"
          label="Description (UZ)"
          rules={[{ required: true, message: "Please enter description in Uzbek" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="description_ru"
          label="Description (RU)"
          rules={[{ required: true, message: "Please enter description in Russian" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="description_en"
          label="Description (EN)"
          rules={[{ required: true, message: "Please enter description in English" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="linked_in_link" label="LinkedIn Link">
          <Input placeholder="https://linkedin.com/in/..." />
        </Form.Item>

        <Form.Item name="telegram_username" label="Telegram Username">
          <Input placeholder="@username" addonBefore="@" />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          name="image"
          label="Profile Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e
            return e?.fileList
          }}
          rules={[{ required: !isEdit, message: "Please upload an image" }]}
        >
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={create.isPending || update.isPending}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default TeamForm
