import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Progress,
  Descriptions,
  Timeline,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";

interface ReservationData {
  id: string;
  quoteId: string;
  clientName: string;
  eventDate: string;
  location: string;
  status: "PROGRAMADA" | "EN_CURSO" | "FINALIZADA" | "CANCELADA";
  progressPercentage: number;
  createdAt: string;
  scheduledFor: string;
  tasks: TaskData[];
}

interface TaskData {
  id: string;
  title: string;
  status: "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" | "CANCELADA";
  assignedTo: string;
  dueDate: string;
}

const AdminReservations: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationData | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para obtener todas las reservas
      // const response = await getAllReservations();
      // setReservations(response.data);

      // Datos de ejemplo
      setReservations([
        {
          id: "1",
          quoteId: "2",
          clientName: "María Rodríguez",
          eventDate: "2024-12-20",
          location: "Centro de Convenciones",
          status: "EN_CURSO",
          progressPercentage: 65,
          createdAt: "2024-10-17T10:30:00Z",
          scheduledFor: "2024-12-20T18:00:00Z",
          tasks: [
            {
              id: "1",
              title: "Instalación de equipo de sonido",
              status: "COMPLETADA",
              assignedTo: "Carlos Mendoza",
              dueDate: "2024-12-20T10:00:00Z",
            },
            {
              id: "2",
              title: "Entrega de mobiliario",
              status: "EN_PROCESO",
              assignedTo: "Ana López",
              dueDate: "2024-12-20T12:00:00Z",
            },
            {
              id: "3",
              title: "Coordinación con catering",
              status: "PENDIENTE",
              assignedTo: "Roberto Silva",
              dueDate: "2024-12-20T14:00:00Z",
            },
          ],
        },
        {
          id: "2",
          quoteId: "3",
          clientName: "Empresa Ejemplo S.A. de C.V.",
          eventDate: "2024-12-25",
          location: "Hotel Real Intercontinental",
          status: "PROGRAMADA",
          progressPercentage: 0,
          createdAt: "2024-10-18T14:20:00Z",
          scheduledFor: "2024-12-25T18:00:00Z",
          tasks: [],
        },
      ]);
    } catch (error) {
      message.error("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const showReservationDetails = (reservation: ReservationData) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  const handleGenerateInvoice = async (reservationId: string) => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para generar la factura
      // await generateInvoice(reservationId);

      message.success("Factura generada exitosamente");
      fetchReservations();
    } catch (error) {
      message.error("Error al generar la factura");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROGRAMADA":
        return "blue";
      case "EN_CURSO":
        return "orange";
      case "FINALIZADA":
        return "green";
      case "CANCELADA":
        return "red";
      default:
        return "default";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "orange";
      case "EN_PROCESO":
        return "blue";
      case "COMPLETADA":
        return "green";
      case "CANCELADA":
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
      title: "Progreso",
      dataIndex: "progressPercentage",
      key: "progressPercentage",
      render: (percentage: number) => (
        <div className="w-24">
          <Progress
            percent={percentage}
            size="small"
            status={percentage === 100 ? "success" : "active"}
          />
        </div>
      ),
    },
    {
      title: "Tareas",
      key: "tasks",
      render: (_, record: ReservationData) => (
        <span>
          {record.tasks.filter((t) => t.status === "COMPLETADA").length} /{" "}
          {record.tasks.length}
        </span>
      ),
    },
    {
      title: "Fecha de Reserva",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record: ReservationData) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showReservationDetails(record)}
          >
            Ver Detalles
          </Button>
          {record.status === "FINALIZADA" && (
            <Button
              type="link"
              icon={<FileTextOutlined />}
              onClick={() => handleGenerateInvoice(record.id)}
              className="text-green-600"
            >
              Generar Factura
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
            Gestión de Reservas
          </h1>
          <p className="text-gray-600">
            Monitorea el progreso de todas las reservas y eventos
          </p>
        </div>

        {/* Resumen de Reservas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reservations.filter((r) => r.status === "PROGRAMADA").length}
              </div>
              <div className="text-sm text-gray-600">Programadas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {reservations.filter((r) => r.status === "EN_CURSO").length}
              </div>
              <div className="text-sm text-gray-600">En Curso</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reservations.filter((r) => r.status === "FINALIZADA").length}
              </div>
              <div className="text-sm text-gray-600">Finalizadas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {reservations.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </Card>
        </div>

        <Card title="Lista de Reservas">
          <Table
            columns={columns}
            dataSource={reservations}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Card>

        {/* Modal de Detalles de Reserva */}
        <Modal
          title={`Detalles de la Reserva - ${selectedReservation?.clientName}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={
            selectedReservation?.status === "FINALIZADA"
              ? [
                  <Button
                    key="invoice"
                    type="primary"
                    icon={<FileTextOutlined />}
                    onClick={() =>
                      handleGenerateInvoice(selectedReservation.id)
                    }
                  >
                    Generar Factura
                  </Button>,
                ]
              : [
                  <Button key="close" onClick={() => setModalVisible(false)}>
                    Cerrar
                  </Button>,
                ]
          }
        >
          {selectedReservation && (
            <div className="space-y-6">
              {/* Información de la Reserva */}
              <Descriptions
                title="Información de la Reserva"
                bordered
                column={2}
              >
                <Descriptions.Item label="Cliente">
                  {selectedReservation.clientName}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha del Evento">
                  {dayjs(selectedReservation.eventDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación">
                  {selectedReservation.location}
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Tag color={getStatusColor(selectedReservation.status)}>
                    {selectedReservation.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Progreso General">
                  <Progress
                    percent={selectedReservation.progressPercentage}
                    status={
                      selectedReservation.progressPercentage === 100
                        ? "success"
                        : "active"
                    }
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Programada para">
                  {dayjs(selectedReservation.scheduledFor).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </Descriptions.Item>
              </Descriptions>

              {/* Tareas Asociadas */}
              {selectedReservation.tasks.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Tareas del Evento
                  </h4>
                  <Table
                    dataSource={selectedReservation.tasks}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Tarea",
                        dataIndex: "title",
                        key: "title",
                      },
                      {
                        title: "Asignada a",
                        dataIndex: "assignedTo",
                        key: "assignedTo",
                      },
                      {
                        title: "Estado",
                        dataIndex: "status",
                        key: "status",
                        render: (status: string) => (
                          <Tag color={getTaskStatusColor(status)}>{status}</Tag>
                        ),
                      },
                      {
                        title: "Fecha Límite",
                        dataIndex: "dueDate",
                        key: "dueDate",
                        render: (date: string) =>
                          dayjs(date).format("DD/MM/YYYY HH:mm"),
                      },
                    ]}
                  />
                </div>
              )}

              {/* Timeline de la Reserva */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Historial de la Reserva
                </h4>
                <Timeline
                  items={[
                    {
                      color: "blue",
                      children: (
                        <div>
                          <div className="font-semibold">Reserva Creada</div>
                          <div className="text-sm text-gray-500">
                            {dayjs(selectedReservation.createdAt).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: "orange",
                      children: (
                        <div>
                          <div className="font-semibold">Tareas Asignadas</div>
                          <div className="text-sm text-gray-500">
                            {selectedReservation.tasks.length} tareas asignadas
                          </div>
                        </div>
                      ),
                    },
                    ...(selectedReservation.status === "EN_CURSO" ||
                    selectedReservation.status === "FINALIZADA"
                      ? [
                          {
                            color: "orange",
                            children: (
                              <div>
                                <div className="font-semibold">
                                  Evento Iniciado
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dayjs(
                                    selectedReservation.scheduledFor
                                  ).format("DD/MM/YYYY HH:mm")}
                                </div>
                              </div>
                            ),
                          },
                        ]
                      : []),
                    ...(selectedReservation.status === "FINALIZADA"
                      ? [
                          {
                            color: "green",
                            children: (
                              <div>
                                <div className="font-semibold">
                                  Evento Finalizado
                                </div>
                                <div className="text-sm text-gray-500">
                                  Todas las tareas completadas
                                </div>
                              </div>
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminReservations;
