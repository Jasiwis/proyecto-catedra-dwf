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
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";

const { TextArea } = Input;

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

const AdminQuotes: React.FC = () => {
  const { user } = useAuth();
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
      // Aquí harías la llamada a la API para obtener todas las cotizaciones
      // const response = await getAllQuotes();
      // setQuotes(response.data);

      // Datos de ejemplo
      setQuotes([
        {
          id: "1",
          requestId: "1",
          clientName: "Juan Pérez González",
          eventDate: "2024-12-25",
          location: "Hotel Real Intercontinental",
          status: "PENDIENTE",
          subtotal: 0,
          taxTotal: 0,
          additionalCosts: 0,
          total: 0,
          createdAt: "2024-10-15T10:30:00Z",
          items: [],
        },
        {
          id: "2",
          requestId: "2",
          clientName: "María Rodríguez",
          eventDate: "2024-12-20",
          location: "Centro de Convenciones",
          status: "APROBADA",
          subtotal: 1800.0,
          taxTotal: 270.0,
          additionalCosts: 50.0,
          total: 2120.0,
          createdAt: "2024-10-14T14:20:00Z",
          items: [
            {
              id: "1",
              description: "Servicio de Música",
              quantity: 1,
              unitPrice: 600.0,
              total: 600.0,
            },
            {
              id: "2",
              description: "Servicio de Catering (30 personas)",
              quantity: 30,
              unitPrice: 35.0,
              total: 1050.0,
            },
            {
              id: "3",
              description: "Mobiliario básico",
              quantity: 1,
              unitPrice: 150.0,
              total: 150.0,
            },
          ],
        },
      ]);
    } catch (error) {
      message.error("Error al cargar las cotizaciones");
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

  const handleSaveQuote = async (values: any) => {
    try {
      setLoading(true);

      const quoteData = {
        id: selectedQuote?.id,
        items: values.items,
        additionalCosts: values.additionalCosts || 0,
      };

      // Aquí harías la llamada a la API para guardar la cotización
      // await saveQuote(quoteData);

      message.success("Cotización guardada exitosamente");
      fetchQuotes();
      setModalVisible(false);
    } catch (error) {
      message.error("Error al guardar la cotización");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToReservation = async (quoteId: string) => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para convertir a reserva
      // await convertToReservation(quoteId);

      message.success("Cotización convertida a reserva exitosamente");
      fetchQuotes();
    } catch (error) {
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
      render: (_, record: QuoteData) => (
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
              onClick={() => handleConvertToReservation(record.id)}
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
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={true}
        userName={user?.name}
        onLogout={() => {}}
      />

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
    </div>
  );
};

export default AdminQuotes;
