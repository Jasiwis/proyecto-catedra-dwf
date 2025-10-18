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
  Input,
  Select,
  DatePicker,
  Form,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";
import { getMyQuotes, approveOrRejectQuote } from "../../api/quote";

interface QuoteData {
  id: string;
  requestId: string;
  eventName: string;
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
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [savedScroll, setSavedScroll] = useState<number>(0);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"APROBAR" | "RECHAZAR">(
    "APROBAR"
  );
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await getMyQuotes({
        q: searchText || undefined,
        status: statusFilter,
        dateFrom: dateRange?.[0]
          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
          : undefined,
        dateTo: dateRange?.[1]
          ? dayjs(dateRange[1]).format("YYYY-MM-DD")
          : undefined,
      });
      const data: QuoteData[] = (response?.data || []).map((q) => ({
        id: q.id,
        requestId: "",
        eventName: q.eventName || "Sin nombre",
        eventDate: q.startDate || q.createdAt,
        location: "",
        status: (q.status === undefined
          ? "PENDIENTE"
          : (q.status as unknown as string).toUpperCase()) as
          | "PENDIENTE"
          | "APROBADA"
          | "RECHAZADA",
        subtotal: Number(q.subtotal ?? 0),
        taxTotal: Number(q.taxTotal ?? 0),
        additionalCosts: Number(q.additionalCosts ?? 0),
        total: Number(q.total ?? 0),
        createdAt: q.createdAt,
        items: (q.items || []).map((item: any) => ({
          id: item.id,
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
      }));
      setQuotes(data);
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

  const showActionModal = (
    quote: QuoteData,
    action: "APROBAR" | "RECHAZAR"
  ) => {
    setSelectedQuote(quote);
    setActionType(action);
    setActionModalVisible(true);
  };

  const handleActionQuote = async () => {
    try {
      if (!selectedQuote) return;

      const values = await form.validateFields();
      setSavedScroll(window.scrollY);
      setLoading(true);

      const response = await approveOrRejectQuote(
        selectedQuote.id,
        actionType,
        values.notes
      );

      if (response.success) {
        if (actionType === "APROBAR") {
          message.success(
            "Cotización aprobada exitosamente. Se ha creado una reservación automáticamente."
          );
        } else {
          message.success("Cotización rechazada");
        }

        fetchQuotes();
        setActionModalVisible(false);
        setModalVisible(false);
        form.resetFields();
        setTimeout(() => window.scrollTo({ top: savedScroll }), 0);
      } else {
        message.error(response.message || "Error al procesar la cotización");
      }
    } catch (error: any) {
      if (error.errorFields) {
        // Validation errors
        return;
      }
      message.error(
        error?.response?.data?.message || "Error al procesar la cotización"
      );
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
      title: "Nombre del Evento",
      dataIndex: "eventName",
      key: "eventName",
      ellipsis: true,
    },
    {
      title: "Fecha del Evento",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a: QuoteData, b: QuoteData) =>
        dayjs(a.eventDate).unix() - dayjs(b.eventDate).unix(),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pendiente", value: "PENDIENTE" },
        { text: "Aprobada", value: "APROBADA" },
        { text: "Rechazada", value: "RECHAZADA" },
      ],
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value: string, record: QuoteData) =>
        String(record.status).toUpperCase() === String(value).toUpperCase(),
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
      sorter: (a: QuoteData, b: QuoteData) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
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
            Ver Detalles
          </Button>
          {record.status === "PENDIENTE" && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => showActionModal(record, "APROBAR")}
                className="text-green-600"
              >
                Aprobar
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => showActionModal(record, "RECHAZAR")}
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

        <Card
          title="Cotizaciones de Eventos"
          extra={
            <Space>
              <Input
                allowClear
                placeholder="Buscar..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 220 }}
              />
              <Select
                allowClear
                placeholder="Estado"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v)}
                options={[
                  { label: "Pendiente", value: "PENDIENTE" },
                  { label: "Aprobada", value: "APROBADA" },
                  { label: "Rechazada", value: "RECHAZADA" },
                ]}
                style={{ width: 160 }}
              />
              <DatePicker.RangePicker
                value={dateRange as any}
                onChange={(val) => setDateRange(val as any)}
              />
              <Button onClick={fetchQuotes} type="primary">
                Buscar
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText("");
                  setStatusFilter(undefined);
                  setDateRange([]);
                  fetchQuotes();
                }}
              />
            </Space>
          }
        >
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={quotes}
              rowKey="id"
              loading={loading}
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              onChange={(pagination, filters) => {
                const status = filters.status?.[0] as string | undefined;
                setStatusFilter(status);
              }}
            />
          </div>
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
                  <Button key="close" onClick={() => setModalVisible(false)}>
                    Cerrar
                  </Button>,
                  <Button
                    key="reject"
                    danger
                    onClick={() => showActionModal(selectedQuote, "RECHAZAR")}
                  >
                    Rechazar
                  </Button>,
                  <Button
                    key="approve"
                    type="primary"
                    onClick={() => showActionModal(selectedQuote, "APROBAR")}
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
                <Descriptions.Item label="Nombre del Evento" span={2}>
                  {selectedQuote.eventName}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha del Evento">
                  {dayjs(selectedQuote.eventDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación">
                  {selectedQuote.location || "N/A"}
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
                <div className="overflow-x-auto">
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

        {/* Modal de Confirmación para Aprobar/Rechazar */}
        <Modal
          title={
            actionType === "APROBAR"
              ? "Aprobar Cotización"
              : "Rechazar Cotización"
          }
          open={actionModalVisible}
          onCancel={() => {
            setActionModalVisible(false);
            form.resetFields();
          }}
          onOk={handleActionQuote}
          okText={actionType === "APROBAR" ? "Aprobar" : "Rechazar"}
          cancelText="Cancelar"
          confirmLoading={loading}
          okButtonProps={{
            danger: actionType === "RECHAZAR",
          }}
        >
          <div className="space-y-4">
            {selectedQuote && (
              <div>
                <p>
                  <strong>Evento:</strong> {selectedQuote.eventName}
                </p>
                <p>
                  <strong>Total:</strong> ${selectedQuote.total.toFixed(2)}
                </p>
              </div>
            )}

            {actionType === "APROBAR" && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-green-800 text-sm">
                  <strong>Importante:</strong> Al aprobar esta cotización, se
                  creará automáticamente una reservación para tu evento en
                  estado "EN PLANEACIÓN".
                </p>
              </div>
            )}

            <Form form={form} layout="vertical">
              <Form.Item
                name="notes"
                label={
                  actionType === "APROBAR"
                    ? "Notas adicionales (opcional)"
                    : "Motivo del rechazo"
                }
                rules={
                  actionType === "RECHAZAR"
                    ? [
                        {
                          required: true,
                          message: "Por favor ingresa el motivo del rechazo",
                        },
                      ]
                    : []
                }
              >
                <Input.TextArea
                  rows={4}
                  placeholder={
                    actionType === "APROBAR"
                      ? "Agrega comentarios o instrucciones especiales..."
                      : "Explica brevemente por qué rechazas esta cotización..."
                  }
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ClientQuotes;
