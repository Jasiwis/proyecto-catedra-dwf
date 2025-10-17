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
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";

const { TextArea } = Input;

interface RequestData {
  id: string;
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
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para obtener las solicitudes del cliente
      // const response = await getClientRequests(user?.id);
      // setRequests(response.data);

      // Datos de ejemplo
      setRequests([
        {
          id: "1",
          eventDate: "2024-12-25",
          location: "Hotel Real Intercontinental",
          requestedServices: "Música, Catering, Mobiliario",
          notes: "Evento corporativo de fin de año",
          status: "PENDIENTE",
          createdAt: "2024-10-15T10:30:00Z",
        },
      ]);
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
        eventDate: values.eventDate.format("YYYY-MM-DD"),
        location: values.location,
        requestedServices: JSON.stringify(values.services),
        notes: values.notes,
        clientId: user?.id,
      };

      // Aquí harías la llamada a la API para crear la solicitud
      // await createRequest(requestData);

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
      title: "Servicios",
      dataIndex: "requestedServices",
      key: "requestedServices",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "PENDIENTE"
            ? "orange"
            : status === "APROBADA"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
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
            <Card title="Mis Solicitudes">
              <Table
                columns={columns}
                dataSource={requests}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
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
