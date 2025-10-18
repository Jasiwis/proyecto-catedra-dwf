import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  message,
  Spin,
  Badge,
  Input,
  DatePicker,
  Form,
  InputNumber,
  Divider,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  FileTextOutlined,
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  DollarOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import dayjs, { Dayjs } from "dayjs";
import { requestsApi } from "../../api/requests";
import { createQuote } from "../../api/quote";
import { getErrorFromResponse } from "../../utils/get-errror-from-response.util";

const { RangePicker } = DatePicker;

interface RequestData {
  id: string;
  clientId?: string;
  clientName?: string;
  eventName: string;
  eventDate: string;
  location: string;
  requestedServices: string;
  notes?: string;
  status: string;
  createdAt: string;
  quotesCount?: number;
}

interface QuoteInfo {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuoteFormData {
  startDate: string;
  endDate: string;
  estimatedHours: number;
  items: QuoteItem[];
  additionalCosts: number;
  notes?: string;
}

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [quotesModalVisible, setQuotesModalVisible] = useState(false);
  const [createQuoteModalVisible, setCreateQuoteModalVisible] = useState(false);
  const [quotes, setQuotes] = useState<QuoteInfo[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [creatingQuote, setCreatingQuote] = useState(false);
  const [hasApprovedQuote, setHasApprovedQuote] = useState(false);

  // Filtros
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  // Form para crear cotización
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, searchText, dateRange]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsApi.getAllRequests();
      console.log("Response from API:", response); // Debug

      const requestsData = (response?.data || []).map((r: any): RequestData => {
        console.log("Processing request:", r); // Debug
        return {
          id: r.id,
          clientId: r.client?.id || r.clientId || null,
          clientName: r.client?.name || "Sin cliente",
          eventName: r.eventName || "Sin nombre",
          eventDate: r.eventDate || "",
          location: r.location || "",
          requestedServices: r.requestedServices || "",
          notes: r.notes,
          status: r.status || "ACTIVO",
          createdAt: r.createdAt || new Date().toISOString(),
        };
      });

      console.log("Processed requests:", requestsData); // Debug
      setRequests(requestsData);

      if (requestsData.length > 0) {
        message.success({
          content: `✅ ${requestsData.length} solicitud${
            requestsData.length > 1 ? "es" : ""
          } cargada${requestsData.length > 1 ? "s" : ""}`,
          duration: 2,
        });
      }
    } catch (error: any) {
      console.error("Error al cargar solicitudes:", error);

      const errorResponse = error?.response?.data;
      if (errorResponse?.errors && errorResponse.errors.length > 0) {
        errorResponse.errors.forEach((err: any) => {
          message.error({
            content: `❌ ${err.message}`,
            duration: 5,
          });
        });
      } else if (errorResponse?.message) {
        message.error({
          content: `❌ ${errorResponse.message}`,
          duration: 5,
        });
      } else {
        message.error({
          content: "❌ Error al cargar las solicitudes",
          duration: 5,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    // Filtro de búsqueda
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.clientName?.toLowerCase().includes(search) ||
          r.eventName.toLowerCase().includes(search) ||
          r.location.toLowerCase().includes(search) ||
          r.requestedServices.toLowerCase().includes(search)
      );
    }

    // Filtro de fechas
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((r) => {
        const eventDate = dayjs(r.eventDate);
        return (
          eventDate.isAfter(dateRange[0]) && eventDate.isBefore(dateRange[1])
        );
      });
    }

    setFilteredRequests(filtered);
  };

  const fetchRequestQuotes = async (requestId: string) => {
    try {
      setLoadingQuotes(true);
      const response = await requestsApi.getRequestQuotes(requestId);
      const quotesData = (response?.data || []).map((q: any) => ({
        id: q.id,
        status: q.status || "PENDIENTE",
        total: q.total || 0,
        createdAt: q.createdAt || new Date().toISOString(),
      }));
      setQuotes(quotesData);

      // Verificar si hay alguna cotización aprobada
      const hasApproved = quotesData.some(
        (q) => q.status === "APROBADA" || q.status === "Aprobada"
      );
      setHasApprovedQuote(hasApproved);
    } catch (error: any) {
      console.error("Error al cargar cotizaciones:", error);

      const errorResponse = error?.response?.data;
      if (errorResponse?.message) {
        message.error({
          content: `❌ Error al cargar cotizaciones: ${errorResponse.message}`,
          duration: 5,
        });
      } else {
        message.error({
          content: "❌ Error al cargar las cotizaciones",
          duration: 5,
        });
      }
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleViewDetails = (request: RequestData) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const handleViewQuotes = async (request: RequestData) => {
    setSelectedRequest(request);
    setQuotesModalVisible(true);
    setHasApprovedQuote(false); // Resetear al abrir
    await fetchRequestQuotes(request.id);
  };

  const handleOpenCreateQuoteModal = () => {
    // Verificar si ya hay una cotización aprobada
    if (hasApprovedQuote) {
      message.warning(
        "Esta solicitud ya tiene una cotización aprobada. No se pueden crear más cotizaciones."
      );
      return;
    }

    setQuotesModalVisible(false);
    setCreateQuoteModalVisible(true);
    form.resetFields();
    // Prellenar fechas sugeridas
    if (selectedRequest) {
      form.setFieldsValue({
        startDate: selectedRequest.eventDate
          ? dayjs(selectedRequest.eventDate)
          : null,
        endDate: selectedRequest.eventDate
          ? dayjs(selectedRequest.eventDate)
          : null,
        estimatedHours: 8,
        additionalCosts: 0,
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
      });
    }
  };

  const handleCreateQuote = async (values: any) => {
    if (!selectedRequest) {
      message.error("No se ha seleccionado ninguna solicitud");
      return;
    }

    // Validar que tengamos clientId
    if (!selectedRequest.clientId) {
      message.error({
        content:
          "❌ No se puede crear la cotización: falta información del cliente",
        duration: 5,
      });
      console.error("Selected Request (sin clientId):", selectedRequest);
      return;
    }

    try {
      setCreatingQuote(true);

      // Validar que haya al menos un item
      if (!values.items || values.items.length === 0) {
        message.error({
          content: "❌ Debe agregar al menos un servicio",
          duration: 5,
        });
        return;
      }

      const quoteData = {
        requestId: selectedRequest.id,
        clientId: selectedRequest.clientId,
        eventName: selectedRequest.eventName,
        estimatedHours: values.estimatedHours,
        startDate: values.startDate
          ? dayjs(values.startDate).format("YYYY-MM-DD")
          : "",
        endDate: values.endDate
          ? dayjs(values.endDate).format("YYYY-MM-DD")
          : "",
        additionalCosts: values.additionalCosts || 0,
        items: values.items,
      };

      console.log("📤 Enviando cotización:", quoteData);

      const response = await createQuote(quoteData);

      console.log("📥 Respuesta del servidor:", response);

      if (response.success) {
        message.success({
          content: "✅ ¡Cotización creada exitosamente!",
          duration: 3,
        });
        setCreateQuoteModalVisible(false);
        setQuotesModalVisible(true);
        await fetchRequestQuotes(selectedRequest.id);
        form.resetFields();
      } else {
        // Mostrar errores de validación si existen
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((error: any) => {
            message.error({
              content: `❌ ${
                error.field !== "internal" ? error.field + ": " : ""
              }${error.message}`,
              duration: 6,
            });
          });
        } else {
          message.error({
            content: `❌ ${response.message || "Error al crear cotización"}`,
            duration: 5,
          });
        }
      }
    } catch (error: any) {
      console.error("❌ Error al crear cotización:", error);

      // Extraer mensaje de error detallado
      const errorResponse = error?.response?.data;

      if (errorResponse?.errors && errorResponse.errors.length > 0) {
        // Mostrar cada error de validación
        errorResponse.errors.forEach((err: any, index: number) => {
          setTimeout(() => {
            message.error({
              content: `❌ ${err.field !== "internal" ? `${err.field}: ` : ""}${
                err.message
              }`,
              duration: 10,
            });
          }, index * 400); // Escalonar las notificaciones
        });
      } else if (errorResponse?.message) {
        message.error({
          content: `❌ ${errorResponse.message}`,
          duration: 6,
        });
      } else if (error?.message) {
        message.error({
          content: `❌ Error: ${error.message}`,
          duration: 5,
        });
      } else {
        message.error({
          content: "❌ Error desconocido al crear cotización",
          duration: 5,
        });
      }
    } finally {
      setCreatingQuote(false);
    }
  };

  const handleClearFilters = () => {
    setSearchText("");
    setDateRange([null, null]);
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      ACTIVO: { color: "green", label: "Activa" },
      INACTIVO: { color: "red", label: "Inactiva" },
    };

    const config = statusMap[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getQuoteStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      PENDIENTE: { color: "orange", label: "Pendiente" },
      Pendiente: { color: "orange", label: "Pendiente" },
      APROBADA: { color: "green", label: "Aprobada" },
      Aprobada: { color: "green", label: "Aprobada" },
      RECHAZADA: { color: "red", label: "Rechazada" },
      Rechazada: { color: "red", label: "Rechazada" },
      CANCELADA: { color: "volcano", label: "Cancelada" },
      Cancelada: { color: "volcano", label: "Cancelada" },
      ENPROCESO: { color: "blue", label: "En Proceso" },
      EnProceso: { color: "blue", label: "En Proceso" },
    };

    const config = statusMap[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const columns: ColumnsType<RequestData> = [
    {
      title: "Cliente",
      dataIndex: "clientName",
      key: "clientName",
      ellipsis: true,
      sorter: (a, b) => (a.clientName || "").localeCompare(b.clientName || ""),
    },
    {
      title: "Nombre del Evento",
      dataIndex: "eventName",
      key: "eventName",
      ellipsis: true,
      sorter: (a, b) => a.eventName.localeCompare(b.eventName),
    },
    {
      title: "Fecha del Evento",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a, b) => dayjs(a.eventDate).unix() - dayjs(b.eventDate).unix(),
    },
    {
      title: "Ubicación",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: "Activa", value: "ACTIVO" },
        { text: "Inactiva", value: "INACTIVO" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Acciones",
      key: "actions",
      fixed: "right",
      width: 250,
      render: (_: any, record: RequestData) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            Detalles
          </Button>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => handleViewQuotes(record)}
            size="small"
          >
            Cotizaciones
          </Button>
        </Space>
      ),
    },
  ];

  const quotesColumns: ColumnsType<QuoteInfo> = [
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getQuoteStatusTag(status),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `$${total.toFixed(2)}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <Space>
            <FileTextOutlined />
            Solicitudes de Eventos
          </Space>
        }
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchRequests}
            loading={loading}
          >
            Actualizar
          </Button>
        }
      >
        {/* Filtros */}
        <Space
          direction="vertical"
          size="middle"
          style={{ width: "100%", marginBottom: 16 }}
        >
          <Space wrap>
            <Input
              placeholder="Buscar por cliente, evento, ubicación..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates || [null, null])}
              format="DD/MM/YYYY"
              placeholder={["Fecha inicio", "Fecha fin"]}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={handleClearFilters}
              disabled={!searchText && !dateRange[0] && !dateRange[1]}
            >
              Limpiar Filtros
            </Button>
          </Space>
          {(searchText || dateRange[0] || dateRange[1]) && (
            <div style={{ color: "#666" }}>
              Mostrando {filteredRequests.length} de {requests.length}{" "}
              solicitudes
            </div>
          )}
        </Space>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total: ${total} solicitudes`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      </Card>

      {/* Modal de Detalles */}
      <Modal
        title="Detalles de Solicitud"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Cerrar
          </Button>,
        ]}
        width={700}
      >
        {selectedRequest && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Cliente">
              {selectedRequest.clientName}
            </Descriptions.Item>
            <Descriptions.Item label="Nombre del Evento">
              {selectedRequest.eventName}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha del Evento">
              {dayjs(selectedRequest.eventDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ubicación">
              {selectedRequest.location}
            </Descriptions.Item>
            <Descriptions.Item label="Servicios Solicitados">
              {selectedRequest.requestedServices}
            </Descriptions.Item>
            <Descriptions.Item label="Notas">
              {selectedRequest.notes || "Sin notas"}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              {getStatusTag(selectedRequest.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha de Creación">
              {dayjs(selectedRequest.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal de Cotizaciones */}
      <Modal
        title={`Cotizaciones para: ${selectedRequest?.eventName || ""}`}
        open={quotesModalVisible}
        onCancel={() => {
          setQuotesModalVisible(false);
          setQuotes([]);
          setHasApprovedQuote(false);
        }}
        footer={[
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreateQuoteModal}
            disabled={hasApprovedQuote}
            title={hasApprovedQuote ? "Ya existe una cotización aprobada" : ""}
          >
            Crear Nueva Cotización
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setQuotesModalVisible(false);
              setQuotes([]);
              setHasApprovedQuote(false);
            }}
          >
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        {loadingQuotes ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <Badge count={quotes.length} showZero color="blue" />
              {hasApprovedQuote && (
                <Tag color="success" icon={<CheckOutlined />}>
                  Esta solicitud ya tiene una cotización aprobada
                </Tag>
              )}
            </div>
            <div className="overflow-x-auto">
              <Table
                columns={quotesColumns}
                dataSource={quotes}
                rowKey="id"
                pagination={false}
                locale={{
                  emptyText: "No hay cotizaciones para esta solicitud",
                }}
              />
            </div>
          </>
        )}
      </Modal>

      {/* Modal para Crear Cotización */}
      <Modal
        title={`Nueva Cotización - ${selectedRequest?.eventName || ""}`}
        open={createQuoteModalVisible}
        onCancel={() => {
          setCreateQuoteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuote}
          initialValues={{
            estimatedHours: 8,
            additionalCosts: 0,
            items: [{ description: "", quantity: 1, unitPrice: 0 }],
          }}
        >
          {/* Información del Evento */}
          {selectedRequest && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Información del Evento</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Cliente:</strong> {selectedRequest.clientName}
                </div>
                <div>
                  <strong>Evento:</strong> {selectedRequest.eventName}
                </div>
                <div>
                  <strong>Fecha:</strong>{" "}
                  {dayjs(selectedRequest.eventDate).format("DD/MM/YYYY")}
                </div>
                <div>
                  <strong>Ubicación:</strong> {selectedRequest.location}
                </div>
              </div>
            </div>
          )}

          <Divider>Detalles de la Cotización</Divider>

          {/* Fechas y Horas */}
          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              label="Fecha de Inicio"
              name="startDate"
              rules={[{ required: true, message: "Fecha de inicio requerida" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Seleccionar fecha"
              />
            </Form.Item>

            <Form.Item
              label="Fecha de Fin"
              name="endDate"
              rules={[{ required: true, message: "Fecha de fin requerida" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Seleccionar fecha"
              />
            </Form.Item>

            <Form.Item
              label="Horas Estimadas"
              name="estimatedHours"
              rules={[
                { required: true, message: "Horas estimadas requeridas" },
              ]}
              tooltip="Duración estimada del evento en horas"
            >
              <InputNumber min={1} style={{ width: "100%" }} placeholder="8" />
            </Form.Item>
          </div>

          <Divider>Servicios del Evento</Divider>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Nota:</strong> Agrega los servicios que incluirá este
              evento (catering, decoración, música, etc.)
              <br />
              El IVA (13%) se calculará automáticamente sobre cada servicio.
            </p>
          </div>

          {/* Lista de Items/Servicios */}
          <Form.List
            name="items"
            rules={[
              {
                validator: async (_, items) => {
                  if (!items || items.length < 1) {
                    return Promise.reject(
                      new Error("Debe agregar al menos un servicio")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      marginBottom: 16,
                      padding: 16,
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      position: "relative",
                    }}
                  >
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-5">
                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          label="Descripción del Servicio"
                          rules={[
                            {
                              required: true,
                              message: "Descripción requerida",
                            },
                          ]}
                        >
                          <Input placeholder="Ej: Catering para 50 personas" />
                        </Form.Item>
                      </div>

                      <div className="col-span-3">
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Cantidad"
                          rules={[
                            { required: true, message: "Cantidad requerida" },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            style={{ width: "100%" }}
                            placeholder="1"
                          />
                        </Form.Item>
                      </div>

                      <div className="col-span-3">
                        <Form.Item
                          {...restField}
                          name={[name, "unitPrice"]}
                          label="Precio Unitario"
                          rules={[
                            {
                              required: true,
                              message: "Precio requerido",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            step={0.01}
                            style={{ width: "100%" }}
                            placeholder="0.00"
                            prefix="$"
                          />
                        </Form.Item>
                      </div>

                      <div className="col-span-1 flex items-end">
                        <Form.Item>
                          <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            disabled={fields.length === 1}
                            title={
                              fields.length === 1
                                ? "Debe haber al menos un servicio"
                                : "Eliminar servicio"
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Agregar Servicio
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>

          <Divider>Costos Adicionales</Divider>

          <Form.Item
            label="Costos Adicionales"
            name="additionalCosts"
            tooltip="Costos adicionales no incluidos en los servicios (transporte, materiales extras, etc.)"
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              placeholder="0.00"
              prefix="$"
            />
          </Form.Item>

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={() => {
                setCreateQuoteModalVisible(false);
                form.resetFields();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creatingQuote}
              icon={<DollarOutlined />}
            >
              Crear Cotización
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminRequests;
