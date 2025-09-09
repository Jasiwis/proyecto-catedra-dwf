import React, { useEffect, useState } from "react";
import { Table, Button, Card, Modal, Tag, message, App } from "antd";
import Header from "../../components/Header/Header";
import { getAllQuotations, createQuote } from "../../api/quote";
import { getAllClients } from "../../api/clients";
import { getProfile } from "../../api/auth";
import type { QuoteResponse, QuoteDto } from "../../interfaces/quote.interface";
import type { ClientResponse } from "../../interfaces/client.interface";
import { QuoteStatus } from "../../enums/quote-status.enum";
import { Status } from "../../enums/status.enum";
import { useNavigate } from "react-router-dom";
import QuoteForm from "../../components/Forms/QuoteForm";
import type { QuoteFormValues } from "../../components/Forms/QuoteForm";

interface ApiError {
  field: string;
  message: string;
}

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
  const navigate = useNavigate();
  const { notification } = App.useApp();

  useEffect(() => {
    fetchQuotes();
    fetchClientsAndUser();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await getAllQuotations();
      setQuotes(res.data || []);
    } catch {
      message.error("Error al cargar cotizaciones");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsAndUser = async () => {
    try {
      const userRes = await getProfile();
      const res = await getAllClients();
      setClients(
        (res.data || []).filter(
          (c) => c.status === Status.Activo && c.createdBy === userRes.data.id
        )
      );
    } catch {
      message.error("Error al cargar clientes o usuario");
    }
  };

  const handleCreate = () => {
    setShowModal(true);
    setApiErrors([]);
  };

  const handleDetail = (id: string) => {
    navigate(`/dashboard/quotes/${id}`);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setApiErrors([]);
  };

  const handleFormSubmit = async (values: QuoteFormValues) => {
    setFormLoading(true);
    setApiErrors([]);
    try {
      const dto: QuoteDto = {
        ...values,
        clientId: values.clientId,
        estimatedHours: values.estimatedHours,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : undefined,
        endDate: values.endDate
          ? values.endDate.format("YYYY-MM-DD")
          : undefined,
        additionalCosts: values.additionalCosts,
      };
      await createQuote(dto);
      notification.success({ message: "Cotización creada correctamente" });
      setShowModal(false);
      fetchQuotes();
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
        notification.error({ message: "Error al crear cotización" });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      title: "Cliente",
      dataIndex: "clientId",
      key: "clientId",
      render: (id: string) => {
        const client = clients.find((c) => c.id === id);
        return client ? client.name : id;
      },
    },
    {
      title: "Horas estimadas",
      dataIndex: "estimatedHours",
      key: "estimatedHours",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === QuoteStatus.Finalizada) color = "green";
        if (status === QuoteStatus.Cancelada) color = "red";
        return (
          <Tag color={color}>
            {status === QuoteStatus.EnProceso ? "En proceso" : status}
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: QuoteResponse) => (
        <Button type="link" onClick={() => handleDetail(record.id)}>
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Header isAuthenticated={true} onLogout={() => {}} />
      <main className="p-6 max-w-screen-lg mx-auto">
        <Card
          title={
            <span className="text-2xl font-bold text-gray-800">
              Cotizaciones
            </span>
          }
          extra={
            <Button type="primary" onClick={handleCreate}>
              Crear nueva cotización
            </Button>
          }
          className="mb-6"
        >
          <Table
            columns={columns}
            dataSource={quotes}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 8 }}
          />
        </Card>
        <Modal
          open={showModal}
          title="Nueva Cotización"
          onCancel={handleModalCancel}
          footer={null}
          destroyOnClose
        >
          <QuoteForm
            onSubmit={handleFormSubmit}
            onCancel={handleModalCancel}
            loading={formLoading}
            apiErrors={apiErrors}
            clients={clients}
          />
        </Modal>
      </main>
    </div>
  );
};

export default QuoteList;
