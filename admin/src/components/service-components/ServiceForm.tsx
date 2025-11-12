import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo, useRef } from "react";
import JoditEditor from "jodit-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useService, useServiceMutations } from "../../hooks/useService";

const ServiceFormPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const selectedId = typeof id === "string" ? id : null;

  const { data: service, isLoading } = useService(selectedId || "");
  const { create, update } = useServiceMutations();

  const [bodyUz, setBodyUz] = useState("");
  const [bodyRu, setBodyRu] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // NEW: category obyektini saqlash; agar yo'q bo'lsa bo'sh stringlar bo'ladi
  const [categoryObj, setCategoryObj] = useState({
    name_uz: "",
    name_ru: "",
    name_en: "",
  });

  // Har bir editor uchun alohida ref
  const joditUz = useRef(null);
  const joditRu = useRef(null);
  const joditEn = useRef(null);

  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        title_uz: service.title_uz,
        title_ru: service.title_ru,
        title_en: service.title_en,
        // category field removed from form values
      });
      setBodyUz(service.description_uz || "");
      setBodyRu(service.description_ru || "");
      setBodyEn(service.description_en || "");

      // Agar service.category mavjud bo'lsa, uni categoryObj ga joylaymiz,
      // aks holda bo'sh stringlar saqlanadi (talabga binoan POSTda bo'sh qoladi)
      setCategoryObj({
        name_uz: service.category?.name_uz || "",
        name_ru: service.category?.name_ru || "",
        name_en: service.category?.name_en || "",
      });
    } else if (!selectedId) {
      form.resetFields();
      setBodyUz("");
      setBodyRu("");
      setBodyEn("");
      setFile(null);
      setCategoryObj({ name_uz: "", name_ru: "", name_en: "" });
    }
  }, [service, form, selectedId]);

  // --- Jodit Config ---
  const createEditorConfig = (lang: "uz" | "ru" | "en") =>
    useMemo(
      () => ({
        readonly: false,
        enableDragAndDropFileToEditor: true,
        width: "100%",
        height: "auto",
        theme: "dark",
        buttons: ["bold", "italic", "strikethrough", "ul", "ol", "image"],

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

          beforeSend: () => {
            toast.loading("Rasm yuklanmoqda...", { id: "uploadingImg" });
          },

          isSuccess: (resp: any) => {
            const data = typeof resp === "string" ? JSON.parse(resp) : resp;
            return !!data.image;
          },

          process: (resp: any) => {
            toast.dismiss("uploadingImg");
            const data = typeof resp === "string" ? JSON.parse(resp) : resp;
            if (data?.image) {
              toast.success("Rasm yuklandi!");
              return {
                files: [{ url: data.image }],
                isSuccess: true,
                path: data.image,
                baseurl: "",
                error: 0,
                msg: "OK",
              };
            } else {
              toast.error("Rasm URL topilmadi.");
              return { files: [], error: 1, msg: "Error" };
            }
          },

          // UPDATED: ko'proq fallbacklarni tekshiradi va tahrirlovchiga rasmni kiritadi.
          defaultHandlerSuccess: (data: any) => {
            const url = data?.files?.[0]?.url;
            if (!url) return;

            const editors = { uz: joditUz, ru: joditRu, en: joditEn } as const;
            const editorRef = editors[lang]?.current as any;

            try {
              // 1️⃣ Jodit instance topish
              const instance = editorRef?.editor || editorRef;
              if (instance && typeof instance.selection?.insertHTML === "function") {
                instance.selection.insertHTML(`<img src="${url}" class="w-[80%] rounded-sm" />`);
                return;
              }

              // 2️⃣ Fallback: setValue bilan qo‘shish
              if (typeof instance?.value === "string") {
                instance.value += `<img src="${url}" class="w-[80%] rounded-sm" />`;
                return;
              }

              // 3️⃣ Oxirgi fallback: react state orqali
              if (lang === "uz") setBodyUz((prev) => prev + `<img src="${url}" class="w-[80%] rounded-sm" />`);
              if (lang === "ru") setBodyRu((prev) => prev + `<img src="${url}" class="w-[80%] rounded-sm" />`);
              if (lang === "en") setBodyEn((prev) => prev + `<img src="${url}" class="w-[80%] rounded-sm" />`);
            } catch (err) {
              console.error("Image insert error:", err);
            }
          },


          error: (err: any) => {
            toast.dismiss("uploadingImg");
            console.error("Image upload failed:", err);
            toast.error("Rasm yuklashda xatolik!");
          },
        },

        events: {
          afterInsertImage: (img: HTMLImageElement) => {
            img.classList.add("w-[80%]", "rounded-sm");
          },
        },
      }),
      [lang]
    );

  const editorConfigUz = createEditorConfig("uz");
  const editorConfigRu = createEditorConfig("ru");
  const editorConfigEn = createEditorConfig("en");

  // --- Submit ---
  const handleSubmit = async () => {
  const values = form.getFieldsValue();
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value) formData.append(key, value as string);
  });

  formData.append("title", values.title_uz); // Example for title
  formData.append("description", bodyUz); // Example for description
  formData.append("description_uz", bodyUz);
  formData.append("description_ru", bodyRu);
  formData.append("description_en", bodyEn);
  if (file) formData.append("image", file);

  // ✅ Category ni obyekt sifatida emas, alohida maydonlar sifatida yuboramiz
  formData.append("category.name_uz", categoryObj.name_uz || "");
  formData.append("category.name_ru", categoryObj.name_ru || "");
  formData.append("category.name_en", categoryObj.name_en || "");

  console.log("Yuborilayotgan ma'lumotlar:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    if (selectedId) {
      await update.mutateAsync({ id: selectedId, data: formData });
      toast.success("Xizmat yangilandi!");
    } else {
      await create.mutateAsync(formData);
      toast.success("Yangi xizmat qo‘shildi!");
    }
    navigate("/services");
  } catch (err) {
    console.error("Saqlashda xatolik:", err);
    toast.error("Saqlashda xatolik yuz berdi!");
  }
};





  if (selectedId && isLoading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold">Yuklanmoqda...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">
        {selectedId ? "Xizmatni tahrirlash" : "Yangi xizmat qo‘shish"}
      </h1>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          name="title_uz"
          label="Sarlavha (UZ)"
          rules={[{ required: true, message: "Iltimos, sarlavha kiriting!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title_ru"
          label="Sarlavha (RU)"
          rules={[{ required: true, message: "Iltimos, sarlavha kiriting!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title_en"
          label="Sarlavha (EN)"
          rules={[{ required: true, message: "Iltimos, sarlavha kiriting!" }]}
        >
          <Input />
        </Form.Item>

        {/* Qo'shilgan: Kategoriya nomlari (foydalanuvchi yozadi) */}
        <Form.Item label="Kategoriya nomi (UZ)"
          rules={[{ required: true, message: "Iltimos, Category kiriting!" }]}
        >
          <Input
            value={categoryObj.name_uz}
            onChange={(e) =>
              setCategoryObj((prev) => ({ ...prev, name_uz: e.target.value }))
            }
            placeholder="Kategoriya nomi (uz)"
          />
        </Form.Item>
        <Form.Item label="Kategoriya nomi (RU)"
          rules={[{ required: true, message: "Iltimos, Category kiriting!" }]}
        >
          <Input
            value={categoryObj.name_ru}
            onChange={(e) =>
              setCategoryObj((prev) => ({ ...prev, name_ru: e.target.value }))
            }
            placeholder="Kategoriya nomi (ru)"
          />
        </Form.Item>
        <Form.Item label="Kategoriya nomi (EN)"
          rules={[{ required: true, message: "Iltimos, Category kiriting!" }]}
        >
          <Input
            value={categoryObj.name_en}
            onChange={(e) =>
              setCategoryObj((prev) => ({ ...prev, name_en: e.target.value }))
            }
            placeholder="Kategoriya nomi (en)"
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="font-medium block mb-1">Tavsif (UZ)</label>
            <JoditEditor
              ref={joditUz}
              value={bodyUz}
              config={editorConfigUz}
              onBlur={(newContent) => setBodyUz(newContent)}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Tavsif (RU)</label>
            <JoditEditor
              ref={joditRu}
              value={bodyRu}
              config={editorConfigRu}
              onBlur={(newContent) => setBodyRu(newContent)}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Tavsif (EN)</label>
            <JoditEditor
              ref={joditEn}
              value={bodyEn}
              config={editorConfigEn}
              onBlur={(newContent) => setBodyEn(newContent)}
            />
          </div>
        </div>

        <Form.Item label="Asosiy rasm" className="mt-4 max-w-sm">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            onRemove={() => setFile(null)}
            maxCount={1}
            fileList={file ? [{ uid: "-1", name: file.name, status: "done" }] : []}
          >
            <Button icon={<UploadOutlined />}>Rasm tanlash</Button>
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => navigate("/services")}>Bekor qilish</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={create.isPending || update.isPending}
          >
            Saqlash
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ServiceFormPage;
