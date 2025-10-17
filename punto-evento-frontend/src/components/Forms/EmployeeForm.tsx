import React, { useEffect } from "react";
import { Form, Input, Select, Button, Space } from "antd";
import type { EmployeeDto } from "../../interfaces/employee.interface";
import { PersonType } from "../../enums/person-type.enum";
import { ContractType } from "../../enums/contract-type.enum";

interface EmployeeFormProps {
  initialValues?: EmployeeDto;
  onSubmit: (values: EmployeeDto) => void;
  onCancel: () => void;
  loading?: boolean;
  apiErrors?: Array<{ field: string; message: string }>;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  apiErrors = [],
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (apiErrors.length > 0) {
      const formErrors = apiErrors.map((error) => ({
        name: error.field,
        errors: [error.message],
      }));
      form.setFields(formErrors);
    }
  }, [apiErrors, form]);

  const handleSubmit = async (values: EmployeeDto) => {
    onSubmit(values);
  };

  const phoneRegex = /^\+?[0-9]{8,15}$/;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      className="space-y-4"
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[
          { required: true, message: "Por favor ingrese el nombre" },
          { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
        ]}
      >
        <Input placeholder="Ingrese el nombre del empleado" />
      </Form.Item>

      <Form.Item
        name="document"
        label="Documento"
        rules={[
          { required: true, message: "Por favor ingrese el documento" },
          { min: 5, message: "El documento debe tener al menos 5 caracteres" },
        ]}
      >
        <Input placeholder="Ingrese el número de documento" />
      </Form.Item>

      <Form.Item
        name="personType"
        label="Tipo de Persona"
        rules={[
          {
            required: true,
            message: "Por favor seleccione el tipo de persona",
          },
        ]}
      >
        <Select placeholder="Seleccione el tipo de persona">
          <Select.Option value={PersonType.Natural}>
            Persona Natural
          </Select.Option>
          <Select.Option value={PersonType.Juridica}>
            Persona Jurídica
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="contractType"
        label="Tipo de Contrato"
        rules={[
          {
            required: true,
            message: "Por favor seleccione el tipo de contrato",
          },
        ]}
      >
        <Select placeholder="Seleccione el tipo de contrato">
          <Select.Option value={ContractType.Permanente}>
            Permanente
          </Select.Option>
          <Select.Option value={ContractType.PorHoras}>Por horas</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="email"
        label="Correo Electrónico"
        rules={[
          {
            required: true,
            message: "Por favor ingrese el correo electrónico",
          },
          { type: "email", message: "Ingrese un correo electrónico válido" },
          {
            max: 100,
            message: "El correo electrónico no debe exceder los 100 caracteres",
          },
        ]}
      >
        <Input placeholder="Ingrese el correo electrónico" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Teléfono"
        rules={[
          {
            required: true,
            message: "Por favor ingrese el número de teléfono",
          },
          {
            pattern: phoneRegex,
            message:
              'El número de teléfono debe tener entre 8 y 15 dígitos, con o sin prefijo "+"',
          },
        ]}
      >
        <Input placeholder="Ingrese el número de teléfono" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Dirección"
        rules={[
          { required: true, message: "Por favor ingrese la dirección" },
          {
            max: 200,
            message: "La dirección no debe exceder los 200 caracteres",
          },
        ]}
      >
        <Input.TextArea placeholder="Ingrese la dirección" rows={3} />
      </Form.Item>

      <Form.Item className="mb-0">
        <Space className="w-full justify-end">
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? "Actualizar" : "Crear"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
