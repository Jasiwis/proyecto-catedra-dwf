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
import { useAuth } from "../../hooks/use-auth";
import dayjs from "dayjs";
import { tasksApi, Task } from "../../api/task";
import { getErrorFromResponse } from "../../utils/get-errror-from-response.util";

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
      const response = await tasksApi.getMyTasks();

      if (response.success && response.data) {
        const tasksData = response.data.map((task: Task) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          status: task.status as
            | "PENDIENTE"
            | "EN_PROCESO"
            | "COMPLETADA"
            | "CANCELADA",
          priority: "MEDIA" as "BAJA" | "MEDIA" | "ALTA", // Por ahora fijo, se puede expandir después
          assignedDate: task.createdAt,
          dueDate: task.endDatetime || task.createdAt,
          completedAt: task.completedAt,
          reservation: {
            id: task.reservationId,
            clientName: task.clientName || "Cliente no disponible",
            eventDate:
              task.reservationScheduledFor ||
              task.startDatetime ||
              task.createdAt,
            location: task.reservationLocation || "Ubicación no disponible",
          },
          progress:
            task.status === "COMPLETADA"
              ? 100
              : task.status === "EN_PROCESO"
              ? 50
              : 0,
        }));
        setTasks(tasksData);
      } else {
        setTasks([]);
      }
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(`Error al cargar las tareas: ${errorMessage}`);
      setTasks([]);
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
      await tasksApi.updateTaskStatus(taskId, "EN_PROCESO");
      message.success(
        "Tarea iniciada. La reservación ha sido marcada como EN CURSO automáticamente."
      );
      fetchTasks();
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(`Error al iniciar la tarea: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await tasksApi.updateTaskStatus(taskId, "COMPLETADA");
      message.success(
        "Tarea completada exitosamente. El progreso de la reservación se ha actualizado automáticamente."
      );
      fetchTasks();
      setModalVisible(false);
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(`Error al completar la tarea: ${errorMessage}`);
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
        <div className="overflow-x-auto">
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
        </div>
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
                    selectedTask.status === "COMPLETADA" ? "success" : "active"
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
                {dayjs(selectedTask.reservation.eventDate).format("DD/MM/YYYY")}
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
  );
};

export default EmployeeTasks;
