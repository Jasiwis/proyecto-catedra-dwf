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
  CheckOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";

interface TaskData {
  id: string;
  title: string;
  description: string;
  status: "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" | "CANCELADA";
  priority: "BAJA" | "MEDIA" | "ALTA";
  assignedDate: string;
  dueDate: string;
  completedAt?: string;
  reservation: {
    id: string;
    clientName: string;
    eventDate: string;
    location: string;
  };
  progress: number;
}

const EmployeeTasks: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para obtener las tareas del empleado
      // const response = await getEmployeeTasks(user?.id);
      // setTasks(response.data);

      // Datos de ejemplo
      setTasks([
        {
          id: "1",
          title: "Instalación de equipo de sonido",
          description:
            "Configurar y probar el sistema de audio para el evento corporativo",
          status: "EN_PROCESO",
          priority: "ALTA",
          assignedDate: "2024-10-15T08:00:00Z",
          dueDate: "2024-12-25T10:00:00Z",
          reservation: {
            id: "1",
            clientName: "Empresa Ejemplo S.A. de C.V.",
            eventDate: "2024-12-25",
            location: "Hotel Real Intercontinental",
          },
          progress: 65,
        },
        {
          id: "2",
          title: "Entrega de mobiliario",
          description: "Entregar y colocar mesas y sillas para el evento",
          status: "PENDIENTE",
          priority: "MEDIA",
          assignedDate: "2024-10-16T09:00:00Z",
          dueDate: "2024-12-25T09:00:00Z",
          reservation: {
            id: "1",
            clientName: "Empresa Ejemplo S.A. de C.V.",
            eventDate: "2024-12-25",
            location: "Hotel Real Intercontinental",
          },
          progress: 0,
        },
        {
          id: "3",
          title: "Coordinación con catering",
          description: "Verificar que el servicio de catering esté listo",
          status: "COMPLETADA",
          priority: "BAJA",
          assignedDate: "2024-10-10T10:00:00Z",
          dueDate: "2024-12-20T17:00:00Z",
          completedAt: "2024-10-17T14:30:00Z",
          reservation: {
            id: "2",
            clientName: "Juan Pérez González",
            eventDate: "2024-12-20",
            location: "Centro de Convenciones",
          },
          progress: 100,
        },
      ]);
    } catch (error) {
      message.error("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const showTaskDetails = (task: TaskData) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleStartTask = async (taskId: string) => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para iniciar la tarea
      // await startTask(taskId);

      message.success("Tarea iniciada");
      fetchTasks();
    } catch (error) {
      message.error("Error al iniciar la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      // Aquí harías la llamada a la API para completar la tarea
      // await completeTask(taskId);

      message.success("Tarea completada exitosamente");
      fetchTasks();
      setModalVisible(false);
    } catch (error) {
      message.error("Error al completar la tarea");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "ALTA":
        return "red";
      case "MEDIA":
        return "orange";
      case "BAJA":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "Pendiente";
      case "EN_PROCESO":
        return "En Proceso";
      case "COMPLETADA":
        return "Completada";
      case "CANCELADA":
        return "Cancelada";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Tarea",
      key: "task",
      render: (_, record: TaskData) => (
        <div>
          <div className="font-semibold">{record.title}</div>
          <div className="text-sm text-gray-500">
            {record.reservation.clientName}
          </div>
        </div>
      ),
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
      title: "Prioridad",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Progreso",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number, record: TaskData) => (
        <div className="w-20">
          <Progress
            percent={progress}
            size="small"
            status={record.status === "COMPLETADA" ? "success" : "active"}
          />
        </div>
      ),
    },
    {
      title: "Fecha Límite",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record: TaskData) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showTaskDetails(record)}
          >
            Ver Detalles
          </Button>
          {record.status === "PENDIENTE" && (
            <Button
              type="link"
              icon={<ClockCircleOutlined />}
              onClick={() => handleStartTask(record.id)}
              className="text-blue-600"
            >
              Iniciar
            </Button>
          )}
          {record.status === "EN_PROCESO" && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleCompleteTask(record.id)}
              className="text-green-600"
            >
              Completar
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Tareas</h1>
          <p className="text-gray-600">
            Gestiona y completa las tareas asignadas a ti
          </p>
        </div>

        {/* Resumen de Tareas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tasks.filter((t) => t.status === "PENDIENTE").length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "EN_PROCESO").length}
              </div>
              <div className="text-sm text-gray-600">En Proceso</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "COMPLETADA").length}
              </div>
              <div className="text-sm text-gray-600">Completadas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </Card>
        </div>

        <Card title="Lista de Tareas">
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Card>

        {/* Modal de Detalles de Tarea */}
        <Modal
          title="Detalles de la Tarea"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={700}
          footer={
            selectedTask?.status === "EN_PROCESO"
              ? [
                  <Button
                    key="complete"
                    type="primary"
                    onClick={() => handleCompleteTask(selectedTask.id)}
                  >
                    Marcar como Completada
                  </Button>,
                ]
              : selectedTask?.status === "PENDIENTE"
              ? [
                  <Button
                    key="start"
                    type="primary"
                    onClick={() => handleStartTask(selectedTask.id)}
                  >
                    Iniciar Tarea
                  </Button>,
                ]
              : [
                  <Button key="close" onClick={() => setModalVisible(false)}>
                    Cerrar
                  </Button>,
                ]
          }
        >
          {selectedTask && (
            <div className="space-y-6">
              {/* Información de la Tarea */}
              <Descriptions title="Información de la Tarea" bordered column={1}>
                <Descriptions.Item label="Título">
                  {selectedTask.title}
                </Descriptions.Item>
                <Descriptions.Item label="Descripción">
                  {selectedTask.description}
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Tag color={getStatusColor(selectedTask.status)}>
                    {getStatusLabel(selectedTask.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Prioridad">
                  <Tag color={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Progreso">
                  <Progress
                    percent={selectedTask.progress}
                    status={
                      selectedTask.status === "COMPLETADA"
                        ? "success"
                        : "active"
                    }
                  />
                </Descriptions.Item>
              </Descriptions>

              {/* Información del Evento */}
              <Descriptions title="Información del Evento" bordered column={1}>
                <Descriptions.Item label="Cliente">
                  {selectedTask.reservation.clientName}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha del Evento">
                  {dayjs(selectedTask.reservation.eventDate).format(
                    "DD/MM/YYYY"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación">
                  {selectedTask.reservation.location}
                </Descriptions.Item>
              </Descriptions>

              {/* Timeline de la Tarea */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Historial de la Tarea
                </h4>
                <Timeline
                  items={[
                    {
                      color: "blue",
                      children: (
                        <div>
                          <div className="font-semibold">Tarea Asignada</div>
                          <div className="text-sm text-gray-500">
                            {dayjs(selectedTask.assignedDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </div>
                        </div>
                      ),
                    },
                    ...(selectedTask.status === "EN_PROCESO" ||
                    selectedTask.status === "COMPLETADA"
                      ? [
                          {
                            color: "orange",
                            children: (
                              <div>
                                <div className="font-semibold">
                                  Tarea Iniciada
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dayjs(selectedTask.assignedDate).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </div>
                              </div>
                            ),
                          },
                        ]
                      : []),
                    ...(selectedTask.status === "COMPLETADA" &&
                    selectedTask.completedAt
                      ? [
                          {
                            color: "green",
                            children: (
                              <div>
                                <div className="font-semibold">
                                  Tarea Completada
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dayjs(selectedTask.completedAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
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

export default EmployeeTasks;
