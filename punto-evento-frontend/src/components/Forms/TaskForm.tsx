import React, { useEffect } from "react";
import { Form, Input, Button, Space, notification } from "antd";
import type { TaskDto } from "../../interfaces/task.interface";

export interface TaskFormValues extends TaskDto {}

interface ApiError {
  field: string;
  message: string;
}

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  apiErrors?: ApiError[];
  initialValues?: Partial<TaskFormValues>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  apiErrors = [],
  initialValues,
}) => {
  const [form] = Form.useForm<TaskFormValues>();

  useEffect(() => {
    if (apiErrors.length > 0) {
      const internalError = apiErrors.find((e) => e.field === "internal");
      if (internalError) {
        notification.error({
          message: "Error",
          description: internalError.message,
        });
      }
      const formErrors = apiErrors
        .filter((e) => e.field !== "internal")
        .map((error) => ({
          name: error.field as keyof TaskFormValues,
          errors: [error.message],
        }));
      form.setFields(formErrors);
    }
  }, [apiErrors, form]);

  const handleFinish = (values: TaskFormValues) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="pt-2"
      initialValues={initialValues}
    >
      <Form.Item
        name="title"
        label="Título"
        rules={[{ required: true, message: "Ingrese el título de la tarea" }]}
      >
        <Input placeholder="Título de la tarea" />
      </Form.Item>
      <Form.Item name="description" label="Descripción">
        <Input.TextArea placeholder="Descripción de la tarea" rows={3} />
      </Form.Item>
      <Form.Item>
        <Space className="w-full justify-end">
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
export type { TaskFormValues };
