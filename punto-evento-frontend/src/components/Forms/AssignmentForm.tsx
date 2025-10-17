import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Space,
  notification,
} from "antd";
import type { EmployeeResponse } from "../../interfaces/employee.interface";
import type { AssignmentDto } from "../../interfaces/assignment.interface";

interface ApiError {
  field: string;
  message: string;
}

export interface AssignmentFormProps {
  onSubmit: (values: AssignmentDto) => void;
  onCancel: () => void;
  loading?: boolean;
  apiErrors?: ApiError[];
  employees: EmployeeResponse[];
  initialValues?: Partial<AssignmentDto>;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  apiErrors = [],
  employees,
  initialValues,
}) => {
  const [form] = Form.useForm<AssignmentDto>();

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
          name: error.field as keyof AssignmentDto,
          errors: [error.message],
        }));
      form.setFields(formErrors);
    }
  }, [apiErrors, form]);

  const handleFinish = (values: AssignmentDto) => {
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
        name="employeeId"
        label="Empleado"
        rules={[{ required: true, message: "Seleccione un empleado" }]}
      >
        <Select placeholder="Seleccione un empleado">
          {employees.map((e) => (
            <Select.Option key={e.id} value={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="title"
        label="Título"
        rules={[{ required: true, message: "Ingrese el título" }]}
      >
        <Input placeholder="Título de la asignación" />
      </Form.Item>
      <Form.Item
        name="startDatetime"
        label="Fecha y hora de inicio"
        rules={[
          { required: true, message: "Seleccione la fecha y hora de inicio" },
        ]}
      >
        <DatePicker showTime className="w-full" />
      </Form.Item>
      <Form.Item
        name="endDatetime"
        label="Fecha y hora de fin"
        rules={[
          { required: true, message: "Seleccione la fecha y hora de fin" },
        ]}
      >
        <DatePicker showTime className="w-full" />
      </Form.Item>
      <Form.Item
        name="estimatedHours"
        label="Horas estimadas"
        rules={[{ required: true, message: "Ingrese las horas estimadas" }]}
      >
        <InputNumber min={1} className="w-full" />
      </Form.Item>
      <Form.Item
        name="baseCost"
        label="Costo base"
        rules={[{ required: true, message: "Ingrese el costo base" }]}
      >
        <InputNumber min={0} className="w-full" />
      </Form.Item>
      <Form.Item
        name="extraPercentage"
        label="Porcentaje extra (%)"
        rules={[{ required: true, message: "Ingrese el porcentaje extra" }]}
      >
        <InputNumber min={0} max={100} className="w-full" />
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
