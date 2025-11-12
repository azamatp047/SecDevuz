// ./src/pages/VacancyFormPage.tsx
import { Form, Input, Upload, Button, DatePicker, Select } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useEffect, useState, useMemo } from "react"
import JoditEditor from "jodit-react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import type { VacancyStatus } from "../../services/vacancy" // type-only import
import { useVacancy, useVacancyMutations } from "../../hooks/useVacancy"

const { Option } = Select;

const VacancyFormPage = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const selectedId = typeof id === "string" ? id : null

    const { data: vacancy, isLoading } = useVacancy(selectedId || "")
    const { create, update } = useVacancyMutations()

    const [descriptionUz, setDescriptionUz] = useState("")
    const [descriptionRu, setDescriptionRu] = useState("")
    const [descriptionEn, setDescriptionEn] = useState("")
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        if (vacancy) {
            form.setFieldsValue({
                title_uz: vacancy.title_uz,
                title_ru: vacancy.title_ru,
                title_en: vacancy.title_en,
                // Check if `vacancy.deadline` is a valid non-empty string before converting
                deadline: vacancy.deadline ? dayjs(vacancy.deadline) : null,
                status: vacancy.status,
            });
            setDescriptionUz(vacancy.description_uz || "");
            setDescriptionRu(vacancy.description_ru || "");
            setDescriptionEn(vacancy.description_en || "");
            setFile(null);
        } else if (!selectedId) {
            form.resetFields();
            setDescriptionUz("");
            setDescriptionRu("");
            setDescriptionEn("");
            setFile(null);
        }
    }, [vacancy, form, selectedId]);


    // --- Jodit Config ---
    const createEditorConfig = () =>
        useMemo(
            () => ({
                readonly: false,
                enableDragAndDropFileToEditor: false,
                width: "100%",
                height: "auto",
                theme: "dark",
                buttons: ["bold", "italic", "strikethrough", "ul", "ol", "link"],
            }),
            []
        );

    const editorConfigUz = createEditorConfig();
    const editorConfigRu = createEditorConfig();
    const editorConfigEn = createEditorConfig();

    // --- Submit ---
    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key === "deadline" && value) {
                // Check if the value is a Dayjs object before converting.
                // The DatePicker from antd returns a Dayjs object.
                if (dayjs.isDayjs(value)) {
                    formData.append(key, value.toISOString());
                }
            } else if (value) {
                formData.append(key, value as string);
            }
        });


        formData.append("description_uz", descriptionUz);
        formData.append("description_ru", descriptionRu);
        formData.append("description_en", descriptionEn);
        formData.append("title", values.title_uz); // Example for title
        formData.append("description", descriptionUz); // Example for description
        if (file) formData.append("image", file);

        console.log("Yuborilayotgan ma'lumotlar:");
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            if (selectedId) {
                await update.mutateAsync({ id: selectedId, data: formData });
                toast.success("Vacancy updated successfully!");
            } else {
                await create.mutateAsync(formData);
                toast.success("New vacancy added successfully!");
            }
            navigate("/vacancies/admin");
        } catch (err) {
            console.error("Error saving vacancy:", err);
            toast.error("Error saving vacancy!");
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
                {selectedId ? "Edit Vacancy" : "Add New Vacancy"}
            </h1>

            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item
                    name="title_uz"
                    label="Title (UZ)"
                    rules={[{ required: true, message: "Please enter title!" }]}
                >
                    <Input maxLength={150} />
                </Form.Item>
                <Form.Item
                    name="title_ru"
                    label="Title (RU)"
                    rules={[{ required: true, message: "Please enter title!" }]}
                >
                    <Input maxLength={150} />
                </Form.Item>
                <Form.Item
                    name="title_en"
                    label="Title (EN)"
                    rules={[{ required: true, message: "Please enter title!" }]}
                >
                    <Input maxLength={150} />
                </Form.Item>

                <Form.Item
                    name="deadline"
                    label="Deadline"
                    rules={[{ required: true, message: "Please select a deadline!" }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: "Please select a status!" }]}
                >
                    <Select placeholder="Select a status">
                        {/* VacancyStatus'ni Option qiymatlari uchun ishlatamiz */}
                        <Option value={"waiting" as VacancyStatus}>Waiting</Option>
                        <Option value={"active" as VacancyStatus}>Active</Option>
                        <Option value={"expired" as VacancyStatus}>Expired</Option>
                    </Select>
                </Form.Item>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="font-medium block mb-1">Description (UZ)</label>
                        <JoditEditor
                            value={descriptionUz}
                            config={editorConfigUz}
                            onBlur={(newContent) => setDescriptionUz(newContent)}
                        />
                    </div>
                    <div>
                        <label className="font-medium block mb-1">Description (RU)</label>
                        <JoditEditor
                            value={descriptionRu}
                            config={editorConfigRu}
                            onBlur={(newContent) => setDescriptionRu(newContent)}
                        />
                    </div>
                    <div>
                        <label className="font-medium block mb-1">Description (EN)</label>
                        <JoditEditor
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
                    <Button onClick={() => navigate("/vacancies/admin")}>Cancel</Button>
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

export default VacancyFormPage;