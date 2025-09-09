import React, { useEffect, useState } from "react";
import { Card, Button, Table, Modal, App, Spin, Popconfirm } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../../api/ssignments";
import {
  getTasksByAssignment,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "../../api/task";
import { getAllEmployees } from "../../api/employee";
import { getQuoteById } from "../../api/quote";
import type {
  AssignmentResponse,
  AssignmentDto,
} from "../../interfaces/assignment.interface";
import type { TaskResponse } from "../../interfaces/task.interface";
import type { EmployeeResponse } from "../../interfaces/employee.interface";
import { AssignmentForm } from "../../components/Forms/AssignmentForm";
import TaskForm from "../../components/Forms/TaskForm";
import type { TaskFormValues } from "../../components/Forms/TaskForm";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import { Status } from "../../enums/status.enum";
import dayjs from "dayjs";
import "dayjs/locale/es";

function formatDateTime(dateStr?: string) {
  if (!dateStr) return "-";

  const hasTime = /T\d{2}:\d{2}/.test(dateStr); // Verifica si hay hora

  const d = dayjs(dateStr);

  return hasTime
    ? d.locale("es").format("D [de] MMMM [de] YYYY [a las] h:mm a")
    : d.locale("es").format("D [de] MMMM [de] YYYY");
}

interface ApiError {
  field: string;
  message: string;
}

const AssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [viewingTask, setViewingTask] = useState<TaskResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [taskFormLoading, setTaskFormLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
  const [taskApiErrors, setTaskApiErrors] = useState<ApiError[]>([]);
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
      fetchTasks(id);
      fetchEmployees();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchAssignment = async (assignmentId: string) => {
    setLoading(true);
    try {
      const res = await getAssignmentById(assignmentId);
      setAssignment(res.data);
      if (res.data.quoteId) {
        const quoteRes = await getQuoteById(res.data.quoteId);
        setQuoteStatus(
          quoteRes.data.status ? String(quoteRes.data.status) : null
        );
      }
    } catch {
      notification.error({ message: "Error al cargar la asignación" });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (assignmentId: string) => {
    try {
      const res = await getTasksByAssignment(assignmentId);
      setTasks(res.data || []);
    } catch {
      notification.error({ message: "Error al cargar tareas" });
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(
        res.data.filter(
          (e) => e.status === Status.Activo && e.createdBy === user?.id
        ) || []
      );
    } catch {
      notification.error({ message: "Error al cargar empleados" });
    }
  };

  // Assignment actions
  const handleEditAssignment = () => {
    setShowEditModal(true);
    setApiErrors([]);
  };

  const handleUpdateAssignment = async (values: AssignmentDto) => {
    if (!id) return;
    setFormLoading(true);
    setApiErrors([]);
    try {
      await updateAssignment(id, values);
      notification.success({ message: "Asignación actualizada" });
      setShowEditModal(false);
      fetchAssignment(id);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object" &&
        (err as { response?: { data?: { errors?: ApiError[] } } }).response
          ?.data?.errors
      ) {
        const apiErrs = (err as { response: { data: { errors: ApiError[] } } })
          .response.data.errors;
        setApiErrors(apiErrs);
        const internalError = apiErrs.find((e) => e.field === "internal");
        if (internalError) {
          notification.error({
            message: "Error",
            description: internalError.message,
          });
        }
      } else {
        notification.error({ message: "Error al actualizar asignación" });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!id) return;
    try {
      await deleteAssignment(id);
      notification.success({ message: "Asignación eliminada" });
      navigate(`/dashboard/quotes/${assignment?.quoteId}`);
    } catch {
      notification.error({ message: "Error al eliminar asignación" });
    }
  };

  // Task actions
  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
    setTaskApiErrors([]);
  };

  const handleEditTask = (task: TaskResponse) => {
    setEditingTask(task);
    setShowTaskModal(true);
    setTaskApiErrors([]);
  };

  const handleViewTask = async (taskId: string) => {
    try {
      const res = await getTaskById(taskId);
      setViewingTask(res.data);
      setShowTaskDetailModal(true);
    } catch {
      notification.error({ message: "Error al cargar tarea" });
    }
  };

  const handleTaskSubmit = async (values: TaskFormValues) => {
    if (!id) return;
    setTaskFormLoading(true);
    setTaskApiErrors([]);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, values);
        notification.success({ message: "Tarea actualizada" });
      } else {
        await createTask(id, values);
        notification.success({ message: "Tarea creada" });
      }
      setShowTaskModal(false);
      fetchTasks(id);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object" &&
        (err as { response?: { data?: { errors?: ApiError[] } } }).response
          ?.data?.errors
      ) {
        const apiErrs = (err as { response: { data: { errors: ApiError[] } } })
          .response.data.errors;
        setTaskApiErrors(apiErrs);
        const internalError = apiErrs.find((e) => e.field === "internal");
        if (internalError) {
          notification.error({
            message: "Error",
            description: internalError.message,
          });
        }
      } else {
        notification.error({ message: "Error al guardar tarea" });
      }
    } finally {
      setTaskFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      notification.success({ message: "Tarea eliminada" });
      if (id) fetchTasks(id);
    } catch {
      notification.error({ message: "Error al eliminar tarea" });
    }
  };

  const handleTaskModalCancel = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setTaskApiErrors([]);
  };

  const handleTaskDetailModalCancel = () => {
    setShowTaskDetailModal(false);
    setViewingTask(null);
  };

  if (!assignment)
    return (
      <div className="p-8 text-center">
        <Spin />
      </div>
    );

  const employee = employees.find((e) => e.id === assignment.employeeId);

  const isAssignmentEditable = quoteStatus === "EnProceso";

  const taskColumns = [
    {
      title: (
        <span>
          <EyeOutlined /> Título
        </span>
      ),
      dataIndex: "title",
      key: "title",
    },
    {
      title: (
        <span>
          <EditOutlined /> Descripción
        </span>
      ),
      dataIndex: "description",
      key: "description",
      render: (desc: string) =>
        desc || <span className="italic text-gray-400">Sin descripción</span>,
    },
    {
      title: (
        <span>
          <EyeOutlined /> Acciones
        </span>
      ),
      key: "actions",
      render: (_: unknown, record: TaskResponse) => (
        <>
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => handleViewTask(record.id)}
          >
            Ver
          </Button>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEditTask(record)}
            disabled={!isAssignmentEditable}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar tarea?"
            onConfirm={() => handleDeleteTask(record.id)}
            okText="Sí"
            cancelText="No"
            disabled={!isAssignmentEditable}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              disabled={!isAssignmentEditable}
            >
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={logout}
        userName={user?.name}
      />
      <main className="p-6 max-w-screen-md min-w-7xl mx-auto">
        <Card
          title={
            <span className="text-2xl font-bold text-gray-800">
              <CalendarOutlined className="mr-2" />
              Detalle de Asignación
            </span>
          }
          className="mb-6"
          loading={loading}
        >
          <div className="space-y-2 mb-6">
            <p>
              <UserOutlined className="mr-2 text-blue-500" />
              <strong>Empleado:</strong>{" "}
              {employee ? employee.name : assignment.employeeId}
            </p>
            <p>
              <EditOutlined className="mr-2 text-purple-500" />
              <strong>Título:</strong> {assignment.title}
            </p>
            <p>
              <CalendarOutlined className="mr-2 text-green-500" />
              <strong>Fechas:</strong>{" "}
              <span className="text-green-500 font-bold">
                {formatDateTime(assignment.startDatetime)} -{" "}
              </span>
              <span className="text-red-600 font-bold">
                {formatDateTime(assignment.endDatetime)}
              </span>
            </p>
            <p>
              <ClockCircleOutlined className="mr-2 text-yellow-500" />
              <strong>Horas estimadas:</strong> {assignment.estimatedHours}
            </p>
            <p>
              <DollarOutlined className="mr-2 text-green-700" />
              <strong>Costo base:</strong> ${assignment.baseCost}
            </p>
            <p>
              <PercentageOutlined className="mr-2 text-pink-500" />
              <strong>Porcentaje extra:</strong> {assignment.extraPercentage}%
            </p>
            <p>
              <CalendarOutlined className="mr-2 text-gray-500" />
              <strong>Creado el:</strong> {formatDateTime(assignment.createdAt)}
            </p>
          </div>
          <div className="mt-6 flex gap-3 mb-6">
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={handleEditAssignment}
              disabled={!isAssignmentEditable}
            >
              Editar asignación
            </Button>
            <Popconfirm
              title="¿Eliminar asignación?"
              onConfirm={handleDeleteAssignment}
              okText="Sí"
              cancelText="No"
              disabled={!isAssignmentEditable}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                disabled={!isAssignmentEditable}
              >
                Eliminar asignación
              </Button>
            </Popconfirm>
            <Button onClick={() => navigate(-1)}>Volver</Button>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              <EyeOutlined className="mr-2" />
              Tareas
            </h2>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleCreateTask}
              disabled={!isAssignmentEditable}
            >
              Crear tarea
            </Button>
          </div>
          <Table
            columns={taskColumns.map((col) =>
              col.key === "actions"
                ? {
                    ...col,
                    render: (_: unknown, record: TaskResponse) => (
                      <>
                        <Button
                          icon={<EyeOutlined />}
                          type="link"
                          onClick={() => handleViewTask(record.id)}
                        >
                          Ver
                        </Button>
                        <Button
                          icon={<EditOutlined />}
                          type="link"
                          onClick={() => handleEditTask(record)}
                          disabled={!isAssignmentEditable}
                        >
                          Editar
                        </Button>
                        <Popconfirm
                          title="¿Eliminar tarea?"
                          onConfirm={() => handleDeleteTask(record.id)}
                          okText="Sí"
                          cancelText="No"
                          disabled={!isAssignmentEditable}
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            type="link"
                            danger
                            disabled={!isAssignmentEditable}
                          >
                            Eliminar
                          </Button>
                        </Popconfirm>
                      </>
                    ),
                  }
                : col
            )}
            dataSource={tasks}
            rowKey="id"
            pagination={false}
          />
        </Card>
        <Modal
          open={showEditModal}
          title={
            <span>
              <EditOutlined className="mr-2" />
              Editar Asignación
            </span>
          }
          onCancel={() => setShowEditModal(false)}
          footer={null}
          destroyOnClose
        >
          {isAssignmentEditable && (
            <AssignmentForm
              onSubmit={handleUpdateAssignment}
              onCancel={() => setShowEditModal(false)}
              loading={formLoading}
              apiErrors={apiErrors}
              employees={employees}
              initialValues={{
                ...assignment,
                startDatetime: assignment.startDatetime
                  ? (dayjs(assignment.startDatetime) as unknown as string)
                  : undefined,
                endDatetime: assignment.endDatetime
                  ? (dayjs(assignment.endDatetime) as unknown as string)
                  : undefined,
              }}
            />
          )}
        </Modal>
        <Modal
          open={showTaskModal}
          title={
            editingTask ? (
              <span>
                <EditOutlined className="mr-2" />
                Editar Tarea
              </span>
            ) : (
              <span>
                <PlusOutlined className="mr-2" />
                Nueva Tarea
              </span>
            )
          }
          onCancel={handleTaskModalCancel}
          footer={null}
          destroyOnClose
        >
          {isAssignmentEditable && (
            <TaskForm
              onSubmit={handleTaskSubmit}
              onCancel={handleTaskModalCancel}
              loading={taskFormLoading}
              apiErrors={taskApiErrors}
              initialValues={editingTask || undefined}
            />
          )}
        </Modal>
        <Modal
          open={showTaskDetailModal}
          title={
            <span>
              <EyeOutlined className="mr-2" />
              Detalle de Tarea
            </span>
          }
          onCancel={handleTaskDetailModalCancel}
          footer={null}
        >
          {viewingTask ? (
            <div className="space-y-2">
              <p>
                <EditOutlined className="mr-2 text-purple-500" />
                <strong>Título:</strong> {viewingTask.title}
              </p>
              <p>
                <EditOutlined className="mr-2 text-gray-500" />
                <strong>Descripción:</strong>{" "}
                {viewingTask.description || (
                  <span className="italic text-gray-400">Sin descripción</span>
                )}
              </p>
              <p>
                <CalendarOutlined className="mr-2 text-gray-500" />
                <strong>Creado el:</strong>{" "}
                {formatDateTime(viewingTask.createdAt)}
              </p>
              <p>
                <CalendarOutlined className="mr-2 text-gray-500" />
                <strong>Actualizado el:</strong>{" "}
                {formatDateTime(viewingTask.updatedAt)}
              </p>
            </div>
          ) : (
            <Spin />
          )}
        </Modal>
      </main>
    </div>
  );
};

export default AssignmentDetail;
