import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Descriptions,
  Divider,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";

interface QuoteData {
  id: string;
  requestId: string;
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

const ClientQuotes: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para obtener las cotizaciones del cliente
      // const response = await getClientQuotes(user?.id);
      // setQuotes(response.data);

      // Datos de ejemplo
      setQuotes([
        {
          id: "1",
          requestId: "1",
          eventDate: "2024-12-25",
          location: "Hotel Real Intercontinental",
          status: "PENDIENTE",
          subtotal: 2500.0,
          taxTotal: 375.0,
          additionalCosts: 100.0,
          total: 2975.0,
          createdAt: "2024-10-15T10:30:00Z",
          items: [
            {
              id: "1",
              description: "Servicio de Música",
              quantity: 1,
              unitPrice: 800.0,
              total: 800.0,
            },
            {
              id: "2",
              description: "Servicio de Catering (50 personas)",
              quantity: 50,
              unitPrice: 25.0,
              total: 1250.0,
            },
            {
              id: "3",
              description: "Mobiliario para evento",
              quantity: 1,
              unitPrice: 450.0,
              total: 450.0,
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
    setModalVisible(true);
  };

  const handleApproveQuote = async (quoteId: string) => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para aprobar la cotización
      // await approveQuote(quoteId);

      message.success("Cotización aprobada exitosamente");
      fetchQuotes();
      setModalVisible(false);
    } catch (error) {
      message.error("Error al aprobar la cotización");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para rechazar la cotización
      // await rejectQuote(quoteId);

      message.success("Cotización rechazada");
      fetchQuotes();
      setModalVisible(false);
    } catch (error) {
      message.error("Error al rechazar la cotización");
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
            Ver Detalles
          </Button>
          {record.status === "PENDIENTE" && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApproveQuote(record.id)}
                className="text-green-600"
              >
                Aprobar
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => handleRejectQuote(record.id)}
                className="text-red-600"
              >
                Rechazar
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Cotizaciones
          </h1>
          <p className="text-gray-600">
            Revisa y gestiona las cotizaciones de tus eventos
          </p>
        </div>

        <Card title="Cotizaciones de Eventos">
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

        {/* Modal de Detalles de Cotización */}
        <Modal
          title="Detalles de la Cotización"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={
            selectedQuote?.status === "PENDIENTE"
              ? [
                  <Button
                    key="reject"
                    danger
                    onClick={() => handleRejectQuote(selectedQuote.id)}
                  >
                    Rechazar
                  </Button>,
                  <Button
                    key="approve"
                    type="primary"
                    onClick={() => handleApproveQuote(selectedQuote.id)}
                  >
                    Aprobar Cotización
                  </Button>,
                ]
              : [
                  <Button key="close" onClick={() => setModalVisible(false)}>
                    Cerrar
                  </Button>,
                ]
          }
        >
          {selectedQuote && (
            <div className="space-y-6">
              {/* Información del Evento */}
              <Descriptions title="Información del Evento" bordered column={2}>
                <Descriptions.Item label="Fecha del Evento">
                  {dayjs(selectedQuote.eventDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación">
                  {selectedQuote.location}
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Tag color={getStatusColor(selectedQuote.status)}>
                    {selectedQuote.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Cotización">
                  {dayjs(selectedQuote.createdAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              {/* Items de la Cotización */}
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  Detalle de Servicios
                </h4>
                <Table
                  dataSource={selectedQuote.items}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: "Descripción",
                      dataIndex: "description",
                      key: "description",
                    },
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      key: "quantity",
                      align: "center" as const,
                    },
                    {
                      title: "Precio Unit.",
                      dataIndex: "unitPrice",
                      key: "unitPrice",
                      render: (price: number) => `$${price.toFixed(2)}`,
                      align: "right" as const,
                    },
                    {
                      title: "Total",
                      dataIndex: "total",
                      key: "total",
                      render: (total: number) => (
                        <span className="font-semibold">
                          ${total.toFixed(2)}
                        </span>
                      ),
                      align: "right" as const,
                    },
                  ]}
                />
              </div>

              <Divider />

              {/* Resumen Financiero */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">
                  Resumen Financiero
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedQuote.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos (15%):</span>
                    <span>${selectedQuote.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costos Adicionales:</span>
                    <span>${selectedQuote.additionalCosts.toFixed(2)}</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ${selectedQuote.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedQuote.status === "PENDIENTE" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    <strong>Nota:</strong> Por favor revisa cuidadosamente los
                    detalles de esta cotización. Una vez aprobada, se procederá
                    a crear la reserva del evento.
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ClientQuotes;
