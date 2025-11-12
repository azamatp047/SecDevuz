import React, { useState } from "react"
import { Table, Modal, Button, Spin, Popconfirm } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useComments, useDeleteComment } from "../../hooks/useComments"
import type { Comment } from "../../services/comments"
import "antd/dist/reset.css"

const CommentsPage: React.FC = () => {
    const { data, isLoading, isError } = useComments()
    const deleteMutation = useDeleteComment()
    const [selected, setSelected] = useState<Comment | null>(null)

    const comments = (data ?? []) as Comment[]

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id.toString())
        } catch (error) {
            Modal.error({
                title: 'Error',
                content: 'Failed to delete comment'
            })
        }
    }   

    const columns: ColumnsType<Comment> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Habar",
            dataIndex: "message",
            render: (text: string) => (
                <span>
                    {text.length > 50 ? text.slice(0, 50) + "..." : text}   
                </span>
            ),
            key: "message",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: Comment) => (
                <>
                    <Button type="link" onClick={() => setSelected(record)}>
                        View
                    </Button>
                    <Popconfirm 
                        title="Are you sure to delete this comment?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Ha"
                        cancelText="Yuq"
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    if (isLoading) return (
        <div className="p-6 flex justify-center">
            <Spin />
        </div>
    )
    if (isError) return <div className="p-4 text-red-600">Failed to load comments</div>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Comments</h1>

            <Table
                dataSource={comments.map((c) => ({ ...c, key: c.id }))}
                columns={columns}
                pagination={{ pageSize: 10 }}
                
            />

            <Modal
                title="Comment details"
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={<Button onClick={() => setSelected(null)}>Close</Button>}
            >
                {selected ? (
                    <div className="space-y-3">
                        <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="font-medium">{selected.name}</div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div className="font-medium">{selected.email}</div>
                        </div>

                        {selected.phone && (
                            <div>
                                <div className="text-sm text-gray-500">Phone</div>
                                <div className="font-medium">{selected.phone}</div>
                            </div>
                        )}

                        {selected.sent_at && (
                            <div>
                                <div className="text-sm text-gray-500">Yuborgn vaqti</div>
                                <div className="font-medium">{new Date(selected.sent_at).toLocaleString()}</div>
                            </div>
                        )}

                        {selected.message && (
                            <div>
                                <div className="text-sm text-gray-500">Message</div>
                                <div className="whitespace-pre-wrap">{selected.message}</div>
                            </div>
                        )}
                    </div>
                ) : null}
            </Modal>
        </div>
    )
}

export default CommentsPage
