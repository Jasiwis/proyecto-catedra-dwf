import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Input,
  Form,
  InputNumber,
} from "antd";
import { EyeOutlined, CheckOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getAllQuotations } from "../../api/quote";

interface QuoteData {
  id: string;
  requestId: string;
  clientName: string;
  eventDate: string;
  location: string;
  status: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  subtotal: number;
  taxTotal: number;
  additionalCosts: number;
  total: number;
  createdAt: string;
  items: QuoteItem[];
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ApiQuote {
  id: string;
  requestId?: string;
  client?: { name?: string };
  startDate?: string;
  location?: string;
  status?: string;
  subtotal?: number;
  taxTotal?: number;
  additionalCosts?: number;
  total?: number;
  createdAt?: string;
}

const AdminQuotes: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await getAllQuotations();
      const quotesData = response.data.map((quote: ApiQuote) => ({
        id: quote.id,
        requestId: quote.requestId || "",
        clientName: quote.client?.name || "Cliente no disponible",
        eventDate: quote.startDate || "",
        location: quote.location || "",
        status: (quote.status || "PENDIENTE") as
          | "PENDIENTE"
          | "APROBADA"
          | "RECHAZADA",
        subtotal: quote.subtotal || 0,
        taxTotal: quote.taxTotal || 0,
        additionalCosts: quote.additionalCosts || 0,
        total: quote.total || 0,
        createdAt: quote.createdAt || new Date().toISOString(),
        items: [], // Por ahora vacío, se puede expandir después
      }));
      setQuotes(quotesData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(`Error al cargar las cotizaciones: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const showQuoteDetails = (quote: QuoteData) => {
    setSelectedQuote(quote);
    form.setFieldsValue({
      items: quote.items || [],
    });
    setModalVisible(true);
  };

  const handleSaveQuote = async () => {
    try {
      setLoading(true);

      // Aquí harías la llamada a la API para guardar la cotización
      // await saveQuote(values);

      message.success("Cotización guardada exitosamente");
      fetchQuotes();
      setModalVisible(false);
    } catch {
      message.error("Error al guardar la cotización");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToReservation = async () => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para convertir a reserva
      // await convertToReservation(selectedQuote?.id);

      message.success("Cotización convertida a reserva exitosamente");
      fetchQuotes();
    } catch {
      message.error("Error al convertir la cotización");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "orange";
      case "APROBADA":
        return "green";
      case "RECHAZADA":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Cliente",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Fecha del Evento",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ubicación",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span className="font-semibold text-green-600">
          ${total.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Fecha de Cotización",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: QuoteData) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showQuoteDetails(record)}
          >
            Ver/Editar
          </Button>
          {record.status === "APROBADA" && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={handleConvertToReservation}
              className="text-green-600"
            >
              Convertir a Reserva
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Cotizaciones
        </h1>
        <p className="text-gray-600">
          Revisa, edita y gestiona todas las cotizaciones del sistema
        </p>
      </div>

      <Card title="Lista de Cotizaciones">
        <Table
          columns={columns}
          dataSource={quotes}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Modal de Edición de Cotización */}
      <Modal
        title={`Editar Cotización - ${selectedQuote?.clientName}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedQuote && (
          <Form form={form} layout="vertical" onFinish={handleSaveQuote}>
            {/* Información del Evento */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Información del Evento</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Cliente:</strong> {selectedQuote.clientName}
                </div>
                <div>
                  <strong>Fecha:</strong>{" "}
                  {dayjs(selectedQuote.eventDate).format("DD/MM/YYYY")}
                </div>
                <div>
                  <strong>Ubicación:</strong> {selectedQuote.location}
                </div>
                <div>
                  <strong>Estado:</strong>{" "}
                  <Tag color={getStatusColor(selectedQuote.status)}>
                    {selectedQuote.status}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Items de la Cotización */}
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Servicios</h4>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<DollarOutlined />}
                    >
                      Agregar Servicio
                    </Button>
                  </div>

                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="border p-4 rounded mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          label="Descripción"
                          rules={[
                            {
                              required: true,
                              message: "Ingresa la descripción",
                            },
                          ]}
                        >
                          <Input placeholder="Descripción del servicio" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Cantidad"
                          rules={[
                            {
                              required: true,
                              message: "Ingresa la cantidad",
                            },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            placeholder="1"
                            className="w-full"
                          />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "unitPrice"]}
                          label="Precio Unit."
                          rules={[
                            {
                              required: true,
                              message: "Ingresa el precio unitario",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            step={0.01}
                            placeholder="0.00"
                            className="w-full"
                          />
                        </Form.Item>

                        <div className="flex items-end">
                          <Button
                            type="link"
                            danger
                            onClick={() => remove(name)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            {/* Costos Adicionales */}
            <Form.Item
              name="additionalCosts"
              label="Costos Adicionales"
              initialValue={selectedQuote.additionalCosts}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full"
                prefix="$"
              />
            </Form.Item>

            {/* Botones */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Guardar Cotización
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminQuotes;
