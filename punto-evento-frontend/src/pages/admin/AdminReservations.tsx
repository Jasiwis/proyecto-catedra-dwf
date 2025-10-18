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
import { EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { reservationsApi } from "../../api/reservations";

interface ReservationData {
  id: string;
  quoteId: string;
  requestId?: string;
  clientName: string;
  eventName: string;
  eventDate: string;
  location: string;
  status:
    | "PROGRAMADA"
    | "EN_CURSO"
    | "FINALIZADA"
    | "CANCELADA"
    | "EN_PLANEACION";
  progressPercentage: number;
  createdAt: string;
  scheduledFor: string;
  quoteTotal?: number;
  tasks: TaskData[];
}

interface TaskData {
  id: string;
  title: string;
  status: "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" | "CANCELADA";
  assignedTo: string;
  dueDate: string;
}

interface ReservationApiResponse {
  id: string;
  quote?: { id: string };
  client?: { name: string };
  eventName?: string;
  scheduledFor?: string;
  location?: string;
  status?: string;
  progressPercentage?: number;
  createdAt?: string;
}

const AdminReservations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationData | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const mapStatusToEnum = (
    status: string
  ):
    | "PROGRAMADA"
    | "EN_CURSO"
    | "FINALIZADA"
    | "CANCELADA"
    | "EN_PLANEACION" => {
    const normalized = String(status).toUpperCase();
    if (normalized === "EN_PLANEACION" || normalized === "ENPLANEACION")
      return "EN_PLANEACION";
    if (normalized === "ACTIVO" || normalized === "PROGRAMADA")
      return "PROGRAMADA";
    if (normalized === "EN_CURSO" || normalized === "ENCURSO")
      return "EN_CURSO";
    if (normalized === "FINALIZADA" || normalized === "INACTIVO")
      return "FINALIZADA";
    if (normalized === "CANCELADA") return "CANCELADA";
    return "EN_PLANEACION"; // Default
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsApi.getAllReservations();

      const reservationsData = (response?.data || []).map(
        (r: ReservationApiResponse): ReservationData => ({
          id: r.id,
          quoteId: r.quote?.id || "",
          requestId: (r.quote as any)?.request?.id,
          clientName: r.client?.name || "Cliente no disponible",
          eventName: r.eventName || "Sin nombre",
          eventDate: r.scheduledFor || "",
          location: r.location || "",
          status: mapStatusToEnum(r.status || "ACTIVO"),
          progressPercentage: Number(r.progressPercentage || 0),
          createdAt: r.createdAt || new Date().toISOString(),
          scheduledFor: r.scheduledFor || "",
          quoteTotal: (r.quote as any)?.total,
          tasks: [], // Las tareas se cargarán por separado si es necesario
        })
      );

      setReservations(reservationsData);
    } catch (error) {
      message.error("Error al cargar las reservas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showReservationDetails = (reservation: ReservationData) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  const handleGenerateInvoice = async () => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para generar la factura
      // await generateInvoice(selectedReservation.id);

      message.success("Factura generada exitosamente");
      fetchReservations();
    } catch {
      message.error("Error al generar la factura");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_PLANEACION":
        return "cyan";
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "EN_PLANEACION":
        return "En Planeación";
      case "PROGRAMADA":
        return "Programada";
      case "EN_CURSO":
        return "En Curso";
      case "FINALIZADA":
        return "Finalizada";
      case "CANCELADA":
        return "Cancelada";
      default:
        return status;
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
    },
    {
      title: "Ubicación",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
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
      render: (_: unknown, record: ReservationData) => (
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
      render: (_: unknown, record: ReservationData) => (
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
              onClick={() => {
                setSelectedReservation(record);
                handleGenerateInvoice();
              }}
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
              <div className="text-2xl font-bold text-cyan-600">
                {
                  reservations.filter((r) => r.status === "EN_PLANEACION")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">En Planeación</div>
            </div>
          </Card>
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
          <div className="overflow-x-auto">
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
          </div>
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
                    onClick={handleGenerateInvoice}
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
                <Descriptions.Item label="Nombre del Evento" span={2}>
                  {selectedReservation.eventName}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha del Evento">
                  {dayjs(selectedReservation.eventDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación">
                  {selectedReservation.location}
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Tag color={getStatusColor(selectedReservation.status)}>
                    {getStatusLabel(selectedReservation.status)}
                  </Tag>
                </Descriptions.Item>
                {selectedReservation.quoteTotal && (
                  <Descriptions.Item label="Total Cotizado">
                    <span className="font-semibold text-green-600">
                      ${Number(selectedReservation.quoteTotal).toFixed(2)}
                    </span>
                  </Descriptions.Item>
                )}
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
                  <div className="overflow-x-auto">
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
                            <Tag color={getTaskStatusColor(status)}>
                              {status}
                            </Tag>
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
