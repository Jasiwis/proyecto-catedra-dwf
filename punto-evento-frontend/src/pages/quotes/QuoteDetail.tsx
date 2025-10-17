/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Button, Tag, Modal, Table, App, Spin, Popconfirm } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getQuoteById, finishQuote, cancelQuote } from "../../api/quote";
import { getAssignmentsByQuote, createAssignment } from "../../api/ssignments";
import { getAllEmployees } from "../../api/employee";
import type { QuoteResponse } from "../../interfaces/quote.interface";
import type {
  AssignmentDto,
  AssignmentResponse,
} from "../../interfaces/assignment.interface";
import type { EmployeeResponse } from "../../interfaces/employee.interface";
import { QuoteStatus } from "../../enums/quote-status.enum";
import { AssignmentForm } from "../../components/Forms/AssignmentForm";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import { Status } from "../../enums/status.enum";

interface ApiError {
  field: string;
  message: string;
}

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (id) {
      fetchQuote(id);
      fetchAssignments(id);
      fetchEmployees();
    }
  }, []);

  const fetchQuote = async (quoteId: string) => {
    setLoading(true);
    try {
      const res = await getQuoteById(quoteId);
      setQuote(res.data);
    } catch {
      notification.error({ message: "Error al cargar la cotización" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (quoteId: string) => {
    try {
      const res = await getAssignmentsByQuote(quoteId);
      setAssignments(res.data || []);
    } catch {
      notification.error({ message: "Error al cargar asignaciones" });
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

  const handleFinishQuote = async () => {
    if (!id) return;
    try {
      await finishQuote(id);
      notification.success({ message: "Cotización finalizada" });
      fetchQuote(id);
    } catch {
      notification.error({ message: "Error al finalizar" });
    }
  };

  const handleCancelQuote = async () => {
    if (!id) return;
    try {
      await cancelQuote(id);
      notification.success({ message: "Cotización cancelada" });
      fetchQuote(id);
    } catch {
      notification.error({ message: "Error al cancelar" });
    }
  };

  if (!quote)
    return (
      <div className="p-8 text-center">
        <Spin />
      </div>
    );

  const canCreateAssignment = quote.status === QuoteStatus.EnProceso;

  const handleCreateAssignment = () => {
    if (!canCreateAssignment) return;
    setShowModal(true);
    setApiErrors([]);
  };

  const handleAssignmentSubmit = async (values: AssignmentDto) => {
    if (!id) return;
    setFormLoading(true);
    setApiErrors([]);
    try {
      const dto: AssignmentDto = {
        employeeId: values.employeeId,
        title: values.title,
        estimatedHours: values.estimatedHours,
        baseCost: values.baseCost,
        extraPercentage: values.extraPercentage,
        startDatetime: values.startDatetime,
        endDatetime: values.endDatetime,
      };
      await createAssignment(id, dto);
      notification.success({ message: "Asignación creada correctamente" });
      setShowModal(false);
      fetchAssignments(id);
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
        notification.error({ message: "Error al crear asignación" });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setApiErrors([]);
  };

  const columns = [
    {
      title: "Empleado",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (id: string) => {
        const emp = employees.find((e) => e.id === id);
        return emp ? emp.name : id;
      },
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Fechas",
      key: "fechas",
      render: (_: unknown, record: AssignmentResponse) => (
        <span>
          {record.startDatetime} a {record.endDatetime}
        </span>
      ),
    },
    {
      title: "Horas estimadas",
      dataIndex: "estimatedHours",
      key: "estimatedHours",
    },
    {
      title: "Costo base",
      dataIndex: "baseCost",
      key: "baseCost",
    },
    {
      title: "Porcentaje extra",
      dataIndex: "extraPercentage",
      key: "extraPercentage",
      render: (val: number) => `${val}%`,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: AssignmentResponse) => (
        <Button
          type="link"
          onClick={() => navigate(`/dashboard/assignments/${record.id}`)}
        >
          Ver detalle
        </Button>
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
              Detalle de Cotización
            </span>
          }
          className="mb-6"
          loading={loading}
        >
          <div className="space-y-2 mb-6">
            <p>
              <strong>Cliente:</strong> {quote.clientId}
            </p>
            <p>
              <strong>Horas estimadas:</strong> {quote.estimatedHours}
            </p>
            <p>
              <strong>Fechas:</strong> {quote.startDate} a {quote.endDate}
            </p>
            <p>
              <strong>Costos adicionales:</strong> ${quote.additionalCosts}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <Tag
                color={
                  quote.status === QuoteStatus.Finalizada
                    ? "green"
                    : quote.status === QuoteStatus.Cancelada
                    ? "red"
                    : "blue"
                }
              >
                {quote.status === QuoteStatus.EnProceso
                  ? "En proceso"
                  : quote.status}
              </Tag>
            </p>
            <p>
              <strong>Creado el:</strong> {quote.createdAt}
            </p>
          </div>
          <div className="mt-6 flex gap-3 mb-6">
            <Popconfirm
              title="¿Finalizar cotización?"
              onConfirm={handleFinishQuote}
              okText="Sí"
              cancelText="No"
            >
              <Button
                type="primary"
                disabled={!(quote.status === QuoteStatus.EnProceso)}
              >
                Finalizar
              </Button>
            </Popconfirm>
            <Popconfirm
              title="¿Cancelar cotización?"
              onConfirm={handleCancelQuote}
              okText="Sí"
              cancelText="No"
            >
              <Button
                danger
                disabled={!(quote.status === QuoteStatus.EnProceso)}
              >
                Cancelar
              </Button>
            </Popconfirm>
            <Button onClick={() => navigate("/dashboard/quotes")}>
              Volver
            </Button>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Asignaciones</h2>
            <Button
              type="primary"
              onClick={handleCreateAssignment}
              disabled={!canCreateAssignment}
            >
              Crear asignación
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={assignments}
            rowKey="id"
            pagination={false}
          />
          <Modal
            open={showModal}
            title="Nueva Asignación"
            onCancel={handleModalCancel}
            footer={null}
            destroyOnClose
            maskClosable={canCreateAssignment}
          >
            {canCreateAssignment && (
              <AssignmentForm
                onSubmit={handleAssignmentSubmit}
                onCancel={handleModalCancel}
                loading={formLoading}
                apiErrors={apiErrors}
                employees={employees}
              />
            )}
          </Modal>
        </Card>
      </main>
    </div>
  );
};

export default QuoteDetail;
