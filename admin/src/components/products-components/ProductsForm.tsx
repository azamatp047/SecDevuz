// src/components/ProductsForm.tsx
import { useEffect, useState, useMemo, useRef } from "react";
import { Form, Input, Button, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useProductMutations, useProduct } from "../../hooks/useProducts";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react"; // Import JoditEditor

const ProductsForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const selectedId = typeof id === "string" ? id : null;

  const { data: product, isLoading } = useProduct(selectedId || "");
  const { create, update } = useProductMutations();

  // State for Jodit Editor content
  const [descriptionUz, setDescriptionUz] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // State for category names (new approach)
  const [categoryObj, setCategoryObj] = useState({
    name_uz: "",
    name_ru: "",
    name_en: "",
  });

  // Refs for Jodit Editors
  const joditUz = useRef(null);
  const joditRu = useRef(null);
  const joditEn = useRef(null);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        title_uz: product.title_uz,
        title_ru: product.title_ru,
        title_en: product.title_en,
        price: parseFloat(product.price),
      });
      setDescriptionUz(product.description_uz || "");
      setDescriptionRu(product.description_ru || "");
      setDescriptionEn(product.description_en || "");

      setCategoryObj({
        name_uz: product.category?.name_uz || "",
        name_ru: product.category?.name_ru || "",
        name_en: product.category?.name_en || "",
      });
      // If product has an image, you might want to display it in the Upload component
      // This part is a bit tricky with Ant Design Upload and pre-filling existing images.
      // For simplicity, we'll assume new image upload replaces existing one.
    } else if (!selectedId) {
      // Reset form for new product
      form.resetFields();
      setDescriptionUz("");
      setDescriptionRu("");
      setDescriptionEn("");
      setFile(null);
      setCategoryObj({ name_uz: "", name_ru: "", name_en: "" });
    }
  }, [product, form, selectedId]);

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
          url: `${import.meta.env.VITE_API_BASE_URL}/images/upload-image/`, // Adjust if different
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
            toast.loading("Rasm yuklanmoqda...", { id: `uploadingImg-${lang}` });
          },

          isSuccess: (resp: any) => {
            const data = typeof resp === "string" ? JSON.parse(resp) : resp;
            return !!data.image;
          },

          process: (resp: any) => {
            toast.dismiss(`uploadingImg-${lang}`);
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

          defaultHandlerSuccess: (data: any) => {
            const url = data?.files?.[0]?.url;
            if (!url) return;

            const editors = { uz: joditUz, ru: joditRu, en: joditEn } as const;
            const editorRef = editors[lang]?.current as any;

            try {
              const instance = editorRef?.editor || editorRef;
              if (instance && typeof instance.selection?.insertHTML === "function") {
                instance.selection.insertHTML(`<img src="${url}" class="w-[80%] rounded-sm" />`);
                return;
              }

              if (typeof instance?.value === "string") {
                instance.value += `<img src="${url}" class="w-[80%] rounded-sm" />`;
                return;
              }

              if (lang === "uz") setDescriptionUz((prev) => prev + `<img src="${url}" class="w-[80%] rounded-sm" />`);
              if (lang === "ru") setDescriptionRu((prev) => prev + `<img src="${url}" class="w-[80%] rounded-sm" />`);
              if (lang === "en") setDescriptionEn((prev) => prev + `<img src="${url}" class="w-[80%] rounded-sm" />`);
            } catch (err) {
              console.error("Image insert error:", err);
            }
          },

          error: (err: any) => {
            toast.dismiss(`uploadingImg-${lang}`);
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
      if (value !== undefined && value !== null) {
        if (key === "price") {
          formData.append(key, String(value)); // Ensure price is sent as string
        } else {
          formData.append(key, value as string);
        }
      }
    });

    formData.append("description_uz", descriptionUz);
    formData.append("description_ru", descriptionRu);
    formData.append("description_en", descriptionEn);
    if (file) formData.append("image", file);

    // Append category names as flattened fields
    formData.append("category.name_uz", categoryObj.name_uz);
    formData.append("category.name_ru", categoryObj.name_ru);
    formData.append("category.name_en", categoryObj.name_en);

    console.log("Submitting FormData for Product:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      if (selectedId) {
        await update.mutateAsync({ id: selectedId, data: formData });
        toast.success("Product updated successfully!");
      } else {
        await create.mutateAsync(formData);
        toast.success("New product added successfully!");
      }
      navigate("/products/admin");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product!");
    }
  };

  if (selectedId && isLoading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">
        {selectedId ? "Edit Product" : "Add New Product"}
      </h1>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Category Name Inputs */}
        <Form.Item
          label="Category Name (UZ)"
          rules={[{ required: true, message: "Please enter category name in Uzbek!" }]}
        >
          <Input
            value={categoryObj.name_uz}
            onChange={(e) =>
              setCategoryObj((prev) => ({ ...prev, name_uz: e.target.value }))
            }
            placeholder="Category name (uz)"
          />
        </Form.Item>
        <Form.Item
          label="Category Name (RU)"
          rules={[{ required: true, message: "Please enter category name in Russian!" }]}
        >
          <Input
            value={categoryObj.name_ru}
            onChange={(e) =>
              setCategoryObj((prev) => ({ ...prev, name_ru: e.target.value }))
            }
            placeholder="Category name (ru)"
          />
        </Form.Item>
        <Form.Item
          label="Category Name (EN)"
          rules={[{ required: true, message: "Please enter category name in English!" }]}
        >
          <Input
            value={categoryObj.name_en}
            onChange={(e) =>
              setCategoryObj((prev) => ({ ...prev, name_en: e.target.value }))
            }
            placeholder="Category name (en)"
          />
        </Form.Item>

        <Form.Item
          name="title_uz"
          label="Title (UZ)"
          rules={[{ required: true, message: "Please enter title in Uzbek!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title_ru"
          label="Title (RU)"
          rules={[{ required: true, message: "Please enter title in Russian!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title_en"
          label="Title (EN)"
          rules={[{ required: true, message: "Please enter title in English!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter product price!" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="font-medium block mb-1">Description (UZ)</label>
            <JoditEditor
              ref={joditUz}
              value={descriptionUz}
              config={editorConfigUz}
              onBlur={(newContent) => setDescriptionUz(newContent)}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Description (RU)</label>
            <JoditEditor
              ref={joditRu}
              value={descriptionRu}
              config={editorConfigRu}
              onBlur={(newContent) => setDescriptionRu(newContent)}
            />
          </div>
          <div>
            <label className="font-medium block mb-1">Description (EN)</label>
            <JoditEditor
              ref={joditEn}
              value={descriptionEn}
              config={editorConfigEn}
              onBlur={(newContent) => setDescriptionEn(newContent)}
            />
          </div>
        </div>

        <Form.Item label="Main Image" className="mt-4 max-w-sm">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            onRemove={() => setFile(null)}
            maxCount={1}
            fileList={file ? [{ uid: "-1", name: file.name, status: "done" }] : []}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => navigate("/products/admin")}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={create.isPending || update.isPending}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductsForm;