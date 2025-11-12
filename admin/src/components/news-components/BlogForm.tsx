import { Form, Input, Upload, Button } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useEffect, useState, useMemo, useRef } from "react"
import JoditEditor from 'jodit-react';
import { useBlog, useBlogMutations } from "../../hooks/useBlog"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const BlogForm = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate();

  const { id } = useParams<{ id?: string }>();
  const selectedId = typeof id === 'string' ? id : null;

  const { data: blog, isLoading: isBlogLoading } = useBlog(selectedId || "");
  const { create, update } = useBlogMutations()

  const [bodyUz, setBodyUz] = useState("")
  const [bodyRu, setBodyRu] = useState("")
  const [bodyEn, setBodyEn] = useState("")
  const [file, setFile] = useState<File | null>(null)

  // Har bir Jodit uchun alohida useRef yaratamiz
  const joditUz = useRef(null);
  const joditRu = useRef(null);
  const joditEn = useRef(null);

  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title_uz: blog.title_uz,
        title_ru: blog.title_ru,
        title_en: blog.title_en,
      })
      setBodyUz(blog.body_uz || "")
      setBodyRu(blog.body_ru || "")
      setBodyEn(blog.body_en || "")
    } else {
      if (!selectedId) {
        form.resetFields()
        setBodyUz("")
        setBodyRu("")
        setBodyEn("")
        setFile(null)
      }
    }
  }, [blog, form, selectedId])

  const createEditorConfig = (lang: "uz" | "ru" | "en") => useMemo(() => ({
    readonly: false,
    enableDragAndDropFileToEditor: true,
    width: '100%',
    height: 'auto',
    theme: 'dark',
    buttons: ['bold', 'italic', 'strikethrough', 'ul', 'ol', 'image'],

    uploader: {
      insertImageAsBase64URI: false,
      url: `${import.meta.env.VITE_API_BASE_URL}/images/upload-image/`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("secdevAccessToken")}`,
      },
      prepareData: (formData: FormData) => {
        const file = formData.get("files[0]");
        formData.delete("files[0]");
        if (file) formData.append("image", file as Blob);
        return formData;
      },
      isSuccess: (resp: any) => {
        const data = typeof resp === "string" ? JSON.parse(resp) : resp;
        return !!data.image;
      },
      process: (resp: any) => {
        const data = resp;
        if (data && data.image) {
          toast.success("Rasm muvaffaqiyatli yuklandi!");
          return {
            files: [{ url: data.image }],
            baseurl: "",
            error: 0,
            msg: "Rasm yuklandi",
          };
        } else {
          toast.error("Rasm URL manzili topilmadi.");
          return { files: [], error: 1, msg: "URL topilmadi" };
        }
      },
      defaultHandlerSuccess: (data: any) => {
        const url = data?.files?.[0]?.url;
        if (url) {
            // Lang bo'yicha qaysi refga murojaat qilishni aniqlash
            if (lang === "uz" && joditUz.current) {
                (joditUz.current as any).s.insertImage(url);
            } else if (lang === "ru" && joditRu.current) {
                (joditRu.current as any).s.insertImage(url);
            } else if (lang === "en" && joditEn.current) {
                (joditEn.current as any).s.insertImage(url);
            }
        }
      },
      error: (e: any) => {
        console.error("Image upload failed:", e);
        toast.error("Rasm yuklashda xatolik yuz berdi");
      },
    },

    events: {
      afterInsertImage: (img: HTMLImageElement) => {
        img.classList.add("w-[80%]", "rounded-sm");
      },
    },

  }), [lang]);

  const editorConfigUz = createEditorConfig("uz")
  const editorConfigRu = createEditorConfig("ru")
  const editorConfigEn = createEditorConfig("en")

  const handleSubmit = async () => {
    const values = form.getFieldsValue()
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value as string)
    })

    formData.append("body_uz", bodyUz)
    formData.append("body_ru", bodyRu)
    formData.append("body_en", bodyEn)
    formData.append("title", values.title_uz) // SEO uchun title maydoniga uz sarlavhasini qo'yamiz
    formData.append("body", bodyUz.slice(0, 160)) // SEO uchun description maydoniga uz tavsifining birinchi 160 ta belgisi

    if (file) {
      formData.append("image", file)
    }

    try {
      if (selectedId) {
        await update.mutateAsync({ id: selectedId, data: formData })
      } else {
        await create.mutateAsync(formData)
      }
      navigate('/blog');
    } catch (error) {
      console.error("Ma'lumotlarni saqlashda xatolik yuz berdi:", error);
      // Xatoni foydalanuvchiga ko'rsatish mumkin
    }
  }

  if (selectedId && isBlogLoading) {
    return (
      <div className="p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Yuklanmoqda...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">
        {selectedId ? "Blogni tahrirlash" : "Yangi blog qo'shish"}
      </h1>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="title_uz" label="Sarlavha (UZ)" rules={[{ required: true, message: 'Iltimos, sarlavhani kiriting!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="title_ru" label="Sarlavha (RU)" rules={[{ required: true, message: 'Iltimos, sarlavhani kiriting!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="title_en" label="Sarlavha (EN)" rules={[{ required: true, message: 'Iltimos, sarlavhani kiriting!' }]}>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <div>
            <label className="font-medium block mb-1">Tavsif (UZ)</label>
            <JoditEditor
              ref={joditUz} // UZ uchun alohida ref
              value={bodyUz}
              config={editorConfigUz}
              onBlur={(newContent) => setBodyUz(newContent)}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Tavsif (RU)</label>
            <JoditEditor
              ref={joditRu} // RU uchun alohida ref
              value={bodyRu}
              config={editorConfigRu}
              onBlur={(newContent) => setBodyRu(newContent)}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Tavsif (EN)</label>
            <JoditEditor
              ref={joditEn} // EN uchun alohida ref
              value={bodyEn}
              config={editorConfigEn}
              onBlur={(newContent) => setBodyEn(newContent)}
            />
          </div>
        </div>

        <Form.Item label="Asosiy rasm yuklash" className="mt-4 max-w-sm">
          <Upload
            beforeUpload={(file) => {
              setFile(file)
              return false
            }}
            onRemove={() => setFile(null)}
            maxCount={1}
            fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
          >
            <Button icon={<UploadOutlined />}>Rasm tanlash</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={create.isPending || update.isPending}>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default BlogForm