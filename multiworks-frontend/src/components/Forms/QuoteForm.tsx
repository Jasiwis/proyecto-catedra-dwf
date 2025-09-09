import React, { useEffect } from "react";
import {
  Form,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Space,
  notification,
} from "antd";
import type { Dayjs } from "dayjs";
import type { QuoteDto } from "../../interfaces/quote.interface";
import type { ClientResponse } from "../../interfaces/client.interface";
import { QuoteStatus } from "../../enums/quote-status.enum";

interface ApiError {
  field: string;
  message: string;
}

interface QuoteFormValues extends Omit<QuoteDto, "startDate" | "endDate"> {
  startDate?: Dayjs;
  endDate?: Dayjs;
}

interface QuoteFormProps {
  onSubmit: (values: QuoteFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  apiErrors?: ApiError[];
  clients: ClientResponse[];
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  apiErrors = [],
  clients,
}) => {
  const [form] = Form.useForm<QuoteFormValues>();

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
          name: error.field as keyof QuoteFormValues,
          errors: [error.message],
        }));
      form.setFields(formErrors);
    }
  }, [apiErrors, form]);

  const handleFinish = (values: QuoteFormValues) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="pt-2"
    >
      <Form.Item
        name="clientId"
        label="Cliente"
        rules={[{ required: true, message: "Seleccione un cliente" }]}
      >
        <Select placeholder="Seleccione un cliente">
          {clients.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="estimatedHours"
        label="Horas estimadas"
        rules={[{ required: true, message: "Ingrese las horas estimadas" }]}
      >
        <InputNumber min={1} className="w-full" />
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Fecha de inicio"
        rules={[{ required: true, message: "Seleccione la fecha de inicio" }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>
      <Form.Item
        name="endDate"
        label="Fecha de fin"
        rules={[{ required: true, message: "Seleccione la fecha de fin" }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>
      <Form.Item
        name="additionalCosts"
        label="Costos adicionales"
        rules={[{ required: true, message: "Ingrese los costos adicionales" }]}
      >
        <InputNumber min={0} className="w-full" />
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

export default QuoteForm;

export type { QuoteFormValues };
