import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Table,
  Tag,
  Space,
  Modal,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";
import { requestsApi } from "../../api/requests";

const { TextArea } = Input;

interface RequestData {
  id: string;
  eventName: string;
  eventDate: string;
  location: string;
  requestedServices: string;
  notes?: string;
  status: string;
  createdAt: string;
}

const ClientRequests: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );

  // Servicios disponibles
  const availableServices = [
    { value: "music", label: "Música" },
    { value: "catering", label: "Catering" },
    { value: "furniture", label: "Mobiliario" },
    { value: "decorations", label: "Decoraciones" },
    { value: "lighting", label: "Iluminación" },
    { value: "sound", label: "Sonido" },
    { value: "security", label: "Seguridad" },
  ];

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsApi.getMyRequests({
        q: searchText || undefined,
        status: statusFilter,
        dateFrom: dateRange?.[0]
          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
          : undefined,
        dateTo: dateRange?.[1]
          ? dayjs(dateRange[1]).format("YYYY-MM-DD")
          : undefined,
      });
      const data = (response?.data || []).map((r) => ({
        id: r.id,
        eventName: r.eventName,
        eventDate: r.eventDate,
        location: r.location,
        requestedServices: r.requestedServices,
        notes: r.notes,
        status: String(r.status).toUpperCase(),
        createdAt: r.createdAt,
      }));
      setRequests(data);
    } catch (error) {
      message.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const requestData = {
        eventName: values.eventName,
        eventDate: values.eventDate.format("YYYY-MM-DD"),
        location: values.location,
        requestedServices: values.services,
        notes: values.notes,
      };
      await requestsApi.createRequest(requestData);

      message.success("Solicitud creada exitosamente");
      form.resetFields();
      fetchRequests();
    } catch (error) {
      message.error("Error al crear la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const showRequestDetails = (request: RequestData) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Nombre del Evento",
      dataIndex: "eventName",
      key: "eventName",
    },
    {
      title: "Fecha del Evento",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a: RequestData, b: RequestData) =>
        dayjs(a.eventDate).unix() - dayjs(b.eventDate).unix(),
    },
    {
      title: "Ubicación",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Servicios",
      dataIndex: "requestedServices",
      key: "requestedServices",
      ellipsis: true,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Activo", value: "ACTIVO" },
        { text: "Inactivo", value: "INACTIVO" },
      ],
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value: string, record: RequestData) =>
        String(record.status).toUpperCase() === String(value).toUpperCase(),
      render: (status: string) => {
        const normalized = String(status).toUpperCase();
        const color =
          normalized === "ACTIVO"
            ? "blue"
            : normalized === "INACTIVO"
            ? "default"
            : "geekblue";
        return <Tag color={color}>{normalized}</Tag>;
      },
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record: RequestData) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showRequestDetails(record)}
          >
            Ver Detalles
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Solicitudes de Eventos
          </h1>
          <p className="text-gray-600">
            Crea nuevas solicitudes y revisa el estado de tus eventos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de Nueva Solicitud */}
          <Card
            title="Nueva Solicitud de Evento"
            className="lg:col-span-1"
            extra={<PlusOutlined />}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="eventName"
                label="Nombre del Evento"
                rules={[
                  {
                    required: true,
                    message: "Ingresa el nombre del evento",
                  },
                ]}
              >
                <Input placeholder="Ej: Boda de María y Juan" />
              </Form.Item>

              <Form.Item
                name="eventDate"
                label="Fecha del Evento"
                rules={[
                  { required: true, message: "Selecciona la fecha del evento" },
                ]}
              >
                <DatePicker
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                name="location"
                label="Ubicación"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la ubicación del evento",
                  },
                ]}
              >
                <Input placeholder="Ej: Hotel Real Intercontinental" />
              </Form.Item>

              <Form.Item
                name="services"
                label="Servicios Requeridos"
                rules={[
                  {
                    required: true,
                    message: "Selecciona al menos un servicio",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona los servicios necesarios"
                  options={availableServices}
                />
              </Form.Item>

              <Form.Item name="notes" label="Notas Adicionales">
                <TextArea
                  rows={4}
                  placeholder="Describe detalles adicionales del evento..."
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full"
                >
                  Crear Solicitud
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Lista de Solicitudes */}
          <div className="lg:col-span-2">
            <Card
              title="Mis Solicitudes"
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
                      { label: "Activo", value: "ACTIVO" },
                      { label: "Inactivo", value: "INACTIVO" },
                    ]}
                    style={{ width: 160 }}
                  />
                  <DatePicker.RangePicker
                    value={dateRange as any}
                    onChange={(val) => setDateRange(val as any)}
                  />
                  <Button onClick={fetchRequests} type="primary">
                    Buscar
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setSearchText("");
                      setStatusFilter(undefined);
                      setDateRange([]);
                      fetchRequests();
                    }}
                  />
                </Space>
              }
            >
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={requests}
                  rowKey="id"
                  loading={loading}
                  scroll={{ x: "max-content" }}
                  pagination={{
                    pageSize: 5,
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
          </div>
        </div>

        {/* Modal de Detalles */}
        <Modal
          title="Detalles de la Solicitud"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setModalVisible(false)}>
              Cerrar
            </Button>,
          ]}
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <strong>Nombre del Evento:</strong> {selectedRequest.eventName}
              </div>
              <div>
                <strong>Fecha del Evento:</strong>{" "}
                {dayjs(selectedRequest.eventDate).format("DD/MM/YYYY")}
              </div>
              <div>
                <strong>Ubicación:</strong> {selectedRequest.location}
              </div>
              <div>
                <strong>Servicios:</strong> {selectedRequest.requestedServices}
              </div>
              <div>
                <strong>Estado:</strong>{" "}
                <Tag color="orange">{selectedRequest.status}</Tag>
              </div>
              {selectedRequest.notes && (
                <div>
                  <strong>Notas:</strong> {selectedRequest.notes}
                </div>
              )}
              <div>
                <strong>Creada:</strong>{" "}
                {dayjs(selectedRequest.createdAt).format("DD/MM/YYYY HH:mm")}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ClientRequests;
