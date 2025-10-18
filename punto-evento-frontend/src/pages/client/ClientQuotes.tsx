import React, { useState, useEffect, useCallback } from "react";
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
import dayjs, { Dayjs } from "dayjs";
import { getMyQuotes, approveOrRejectQuote } from "../../api/quote";

interface QuoteData {
  id: string;
  requestId: string;
  eventName: string;
  eventDate: string;
  location: string;
  status: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "ENPROCESO" | "EN_PROCESO";
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
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [savedScroll, setSavedScroll] = useState<number>(0);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"APROBAR" | "RECHAZAR">(
    "APROBAR"
  );
  const [form] = Form.useForm();

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyQuotes({
        q: searchText || undefined,
        status: statusFilter,
        dateFrom:
          dateRange?.[0] && dateRange[0]
            ? dateRange[0].format("YYYY-MM-DD")
            : undefined,
        dateTo:
          dateRange?.[1] && dateRange[1]
            ? dateRange[1].format("YYYY-MM-DD")
            : undefined,
      });
      const data: QuoteData[] = (response?.data || []).map(
        (q: {
          id: string;
          eventName?: string;
          startDate?: string;
          createdAt?: string;
          status?: string;
          subtotal?: number;
          taxTotal?: number;
          additionalCosts?: number;
          total?: number;
          items?: Array<{
            id: string;
            description: string;
            quantity: number;
            unitPrice: number;
            total: number;
          }>;
        }) => {
          const statusFromBackend = q.status;
          const normalizedStatus = (
            q.status === undefined
              ? "PENDIENTE"
              : (q.status as unknown as string).toUpperCase()
          ) as
            | "PENDIENTE"
            | "APROBADA"
            | "RECHAZADA"
            | "ENPROCESO"
            | "EN_PROCESO";

          console.log("🔍 Cotización:", {
            id: q.id,
            eventName: q.eventName,
            statusFromBackend,
            normalizedStatus,
          });

          return {
            id: q.id,
            requestId: "",
            eventName: q.eventName || "Sin nombre",
            eventDate: q.startDate || q.createdAt || "",
            location: "",
            status: normalizedStatus,
            subtotal: Number(q.subtotal ?? 0),
            taxTotal: Number(q.taxTotal ?? 0),
            additionalCosts: Number(q.additionalCosts ?? 0),
            total: Number(q.total ?? 0),
            createdAt: q.createdAt || "",
            items: (q.items || []).map((item) => ({
              id: item.id,
              description: item.description,
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              total: Number(item.total),
            })),
          };
        }
      );

      console.log("📊 Cotizaciones cargadas:", data);
      setQuotes(data);
    } catch (error: unknown) {
      console.error("Error al cargar cotizaciones:", error);
      message.error("Error al cargar las cotizaciones");
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter, dateRange]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

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

      console.log("📤 Procesando acción:", {
        quoteId: selectedQuote.id,
        action: actionType,
        notes: values.notes,
      });

      const response = await approveOrRejectQuote(
        selectedQuote.id,
        actionType,
        values.notes
      );

      console.log("📥 Respuesta del servidor:", response);

      if (response.success) {
        if (actionType === "APROBAR") {
          message.success({
            content:
              "✅ ¡Cotización aprobada exitosamente! Se ha creado una reservación en estado 'En Planeación'. Puedes verla en la sección de Mis Reservaciones.",
            duration: 6,
          });
        } else {
          message.success({
            content: "✅ Cotización rechazada correctamente",
            duration: 4,
          });
        }

        // Refrescar la lista de cotizaciones
        await fetchQuotes();
        setActionModalVisible(false);
        setModalVisible(false);
        form.resetFields();
        setTimeout(() => window.scrollTo({ top: savedScroll }), 100);
      } else {
        // Mostrar errores de validación si existen
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((err, index) => {
            setTimeout(() => {
              message.error({
                content: `❌ ${
                  err.field !== "internal" ? `${err.field}: ` : ""
                }${err.message}`,
                duration: 8,
              });
            }, index * 400);
          });
        } else {
          message.error({
            content: `❌ ${
              response.message || "Error al procesar la cotización"
            }`,
            duration: 5,
          });
        }
      }
    } catch (error: unknown) {
      console.error("❌ Error al procesar cotización:", error);

      if ((error as { errorFields?: unknown })?.errorFields) {
        // Validation errors from form
        return;
      }

      // Extraer mensaje de error detallado
      const errorResponse = (
        error as {
          response?: {
            data?: {
              errors?: Array<{ field: string; message: string }>;
              message?: string;
            };
          };
        }
      )?.response?.data;

      if (errorResponse?.errors && errorResponse.errors.length > 0) {
        // Mostrar cada error de validación
        errorResponse.errors.forEach((err, index) => {
          setTimeout(() => {
            message.error({
              content: `❌ ${err.field !== "internal" ? `${err.field}: ` : ""}${
                err.message
              }`,
              duration: 10,
            });
          }, index * 400);
        });
      } else if (errorResponse?.message) {
        message.error({
          content: `❌ ${errorResponse.message}`,
          duration: 6,
        });
      } else if ((error as Error)?.message) {
        message.error({
          content: `❌ Error: ${(error as Error).message}`,
          duration: 5,
        });
      } else {
        message.error({
          content: "❌ Error desconocido al procesar la cotización",
          duration: 5,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const normalized = status.toUpperCase();
    switch (normalized) {
      case "PENDIENTE":
        return "orange";
      case "APROBADA":
        return "green";
      case "RECHAZADA":
        return "red";
      case "ENPROCESO":
      case "EN_PROCESO":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    const normalized = status.toUpperCase();
    switch (normalized) {
      case "PENDIENTE":
        return "Pendiente";
      case "APROBADA":
        return "Aprobada";
      case "RECHAZADA":
        return "Rechazada";
      case "ENPROCESO":
      case "EN_PROCESO":
        return "En Proceso";
      default:
        return status;
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
      onFilter: (value: boolean | React.Key, record: QuoteData) =>
        String(record.status).toUpperCase() === String(value).toUpperCase(),
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
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
          {(record.status === "PENDIENTE" ||
            record.status === "ENPROCESO" ||
            record.status === "EN_PROCESO" ||
            record.status.toUpperCase() === "PENDIENTE" ||
            record.status.toUpperCase() === "ENPROCESO" ||
            record.status.toUpperCase() === "EN_PROCESO") && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => {
                  console.log("🟢 Click Aprobar - Cotización:", record);
                  showActionModal(record, "APROBAR");
                }}
                className="text-green-600"
              >
                Aprobar
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => {
                  console.log("🔴 Click Rechazar - Cotización:", record);
                  showActionModal(record, "RECHAZAR");
                }}
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
                value={dateRange}
                onChange={(val) => setDateRange(val)}
              />
              <Button onClick={fetchQuotes} type="primary">
                Buscar
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText("");
                  setStatusFilter(undefined);
                  setDateRange(null);
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
              onChange={(_pagination, filters) => {
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
            selectedQuote &&
            (selectedQuote.status === "PENDIENTE" ||
              selectedQuote.status === "ENPROCESO" ||
              selectedQuote.status === "EN_PROCESO" ||
              selectedQuote.status.toUpperCase() === "PENDIENTE" ||
              selectedQuote.status.toUpperCase() === "ENPROCESO" ||
              selectedQuote.status.toUpperCase() === "EN_PROCESO")
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

              {(selectedQuote.status === "PENDIENTE" ||
                selectedQuote.status === "ENPROCESO" ||
                selectedQuote.status === "EN_PROCESO" ||
                selectedQuote.status.toUpperCase() === "PENDIENTE" ||
                selectedQuote.status.toUpperCase() === "ENPROCESO" ||
                selectedQuote.status.toUpperCase() === "EN_PROCESO") && (
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
            <div className="flex items-center gap-2">
              {actionType === "APROBAR" ? (
                <>
                  <CheckOutlined className="text-green-600" />
                  <span>Aprobar Cotización</span>
                </>
              ) : (
                <>
                  <CloseOutlined className="text-red-600" />
                  <span>Rechazar Cotización</span>
                </>
              )}
            </div>
          }
          open={actionModalVisible}
          onCancel={() => {
            setActionModalVisible(false);
            form.resetFields();
          }}
          onOk={handleActionQuote}
          okText={
            actionType === "APROBAR" ? (
              <span>
                <CheckOutlined /> Confirmar Aprobación
              </span>
            ) : (
              <span>
                <CloseOutlined /> Confirmar Rechazo
              </span>
            )
          }
          cancelText="Cancelar"
          confirmLoading={loading}
          okButtonProps={{
            danger: actionType === "RECHAZAR",
            type: actionType === "APROBAR" ? "primary" : "default",
            size: "large",
          }}
          cancelButtonProps={{
            size: "large",
          }}
          width={600}
        >
          <div className="space-y-4 py-2">
            {selectedQuote && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Detalles de la Cotización
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Evento:</span>
                    <span className="font-medium">
                      {selectedQuote.eventName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fecha del Evento:</span>
                    <span className="font-medium">
                      {dayjs(selectedQuote.eventDate).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="text-gray-600 font-semibold">
                      Total a Pagar:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      ${selectedQuote.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {actionType === "APROBAR" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-300">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <CheckOutlined className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-green-900 font-semibold mb-1">
                      ¿Qué sucederá al aprobar?
                    </p>
                    <ul className="text-green-800 text-sm space-y-1 list-disc list-inside">
                      <li>
                        Se creará automáticamente una{" "}
                        <strong>reservación</strong> en estado "En Planeación"
                      </li>
                      <li>
                        Podrás ver tu reservación en la sección{" "}
                        <strong>"Mis Reservaciones"</strong>
                      </li>
                      <li>
                        El equipo comenzará a planificar los detalles de tu
                        evento
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {actionType === "RECHAZAR" && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <CloseOutlined className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-red-900 font-semibold mb-1">
                      Importante
                    </p>
                    <p className="text-red-800 text-sm">
                      Al rechazar esta cotización, podrás solicitar una nueva
                      cotización ajustada a tus necesidades. Por favor, explica
                      el motivo del rechazo para que podamos mejorar nuestra
                      propuesta.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Form form={form} layout="vertical">
              <Form.Item
                name="notes"
                label={
                  <span className="font-semibold">
                    {actionType === "APROBAR"
                      ? "Comentarios o instrucciones especiales"
                      : "Motivo del rechazo"}
                    {actionType === "APROBAR" && (
                      <span className="text-gray-400 font-normal ml-2">
                        (opcional)
                      </span>
                    )}
                    {actionType === "RECHAZAR" && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                }
                rules={
                  actionType === "RECHAZAR"
                    ? [
                        {
                          required: true,
                          message: "Por favor ingresa el motivo del rechazo",
                        },
                        {
                          min: 10,
                          message:
                            "Por favor proporciona más detalles (mínimo 10 caracteres)",
                        },
                      ]
                    : []
                }
              >
                <Input.TextArea
                  rows={4}
                  placeholder={
                    actionType === "APROBAR"
                      ? "Ejemplo: Por favor considerar decoración adicional en tonos dorados..."
                      : "Ejemplo: El precio excede mi presupuesto, necesito opciones más económicas..."
                  }
                  showCount
                  maxLength={500}
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
