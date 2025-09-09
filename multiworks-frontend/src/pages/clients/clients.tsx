import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Typography,
  Button,
  Row,
  Tag,
  Spin,
  Space,
  Tooltip,
  Modal,
  App,
  Descriptions,
  Divider,
} from "antd";
import {
  UserOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import type {
  ClientResponse,
  ClientDto,
} from "../../interfaces/client.interface";
import {
  getAllClients,
  createClient,
  updateClient,
  updateClientStatus,
} from "../../api/clients";
import { Status } from "../../enums/status.enum";
import { PersonType } from "../../enums/person-type.enum";
import ClientForm from "../../components/Forms/ClientForm";
import type { AxiosError } from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const { Title, Text } = Typography;

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data: null;
  errors: Array<{ field: string; message: string }>;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailsModalVisible, setDetailsModalVisible] =
    useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(
    null
  );
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [apiErrors, setApiErrors] = useState<
    Array<{ field: string; message: string }>
  >([]);
  const { isAuthenticated, user, logout } = useAuth();
  const { notification } = App.useApp();

  const showSuccessNotification = (title: string, description: string) => {
    notification.success({
      message: title,
      description,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      placement: "topRight",
      duration: 4.5,
    });
  };

  const showErrorNotification = (title: string, description: string) => {
    notification.error({
      message: title,
      description,
      icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      placement: "topRight",
      duration: 4.5,
    });
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getAllClients();
      setClients(
        response.data.sort((a, b) => a.status.localeCompare(b.status))
      );
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showErrorNotification(
        "Error al Cargar Clientes",
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (values: ClientDto) => {
    try {
      setFormLoading(true);
      setApiErrors([]);
      await createClient(values);
      showSuccessNotification(
        "Cliente Creado",
        `El cliente "${values.name}" ha sido creado exitosamente`
      );
      setModalVisible(false);
      fetchClients();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      if (error.response?.data?.errors) {
        setApiErrors(error.response.data.errors);
        showErrorNotification(
          "Error de Validación",
          "Por favor, corrija los errores en el formulario"
        );
      } else {
        showErrorNotification(
          "Error al Crear Cliente",
          error instanceof Error ? error.message : "Error desconocido"
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateClient = async (values: ClientDto) => {
    if (!selectedClient) return;
    try {
      setFormLoading(true);
      setApiErrors([]);
      await updateClient(selectedClient.id, values);
      showSuccessNotification(
        "Cliente Actualizado",
        `El cliente "${values.name}" ha sido actualizado exitosamente`
      );
      setModalVisible(false);
      fetchClients();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      if (error.response?.data?.errors) {
        setApiErrors(error.response.data.errors);
        showErrorNotification(
          "Error de Validación",
          "Por favor, corrija los errores en el formulario"
        );
      } else {
        showErrorNotification(
          "Error al Actualizar Cliente",
          error instanceof Error ? error.message : "Error desconocido"
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (clientId: string) => {
    try {
      const client = clients.find((c) => c.id === clientId);
      if (!client) return;

      await updateClientStatus(clientId);
      const newStatus =
        client.status === Status.Activo ? "inactivado" : "activado";
      showSuccessNotification(
        "Estado Actualizado",
        `El cliente "${client.name}" ha sido ${newStatus} exitosamente`
      );
      fetchClients();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showErrorNotification(
        "Error al Cambiar Estado",
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  const getStatusTag = (status?: Status) => {
    if (!status) return <Tag>Desconocido</Tag>;
    switch (status) {
      case Status.Activo:
        return <Tag color="green">Activo</Tag>;
      case Status.Inactivo:
        return <Tag color="red">Inactivo</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const showModal = (client?: ClientResponse) => {
    setSelectedClient(client || null);
    setModalVisible(true);
    setApiErrors([]);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedClient(null);
    setApiErrors([]);
  };

  const showClientDetails = (client: ClientResponse) => {
    setSelectedClient(client);
    setDetailsModalVisible(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "No disponible";
    return format(date, "PPP 'a las' p", { locale: es });
  };

  const getPersonTypeLabel = (type: PersonType) => {
    return type === PersonType.Natural ? "Persona Natural" : "Persona Jurídica";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        onLogout={logout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row justify="space-between" align="middle" className="mb-6">
          <Title level={2}>Clientes</Title>
          <div className="space-x-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchClients}
              disabled={loading}
            >
              Recargar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Nuevo Cliente
            </Button>
          </div>
        </Row>

        <Card className="shadow-sm">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={clients}
              locale={{ emptyText: "No hay clientes registrados." }}
              renderItem={(client) => (
                <List.Item
                  key={client.id}
                  className="hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4"
                >
                  <List.Item.Meta
                    avatar={<UserOutlined className="text-2xl text-blue-500" />}
                    title={
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          {client.name} {getStatusTag(client.status)}
                        </span>
                        <Space>
                          <Tooltip title="Ver Detalle">
                            <Button
                              icon={<EyeOutlined />}
                              onClick={() => showClientDetails(client)}
                            />
                          </Tooltip>
                          <Tooltip title="Editar Cliente">
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => showModal(client)}
                            />
                          </Tooltip>
                          {client.status === Status.Activo ? (
                            <Tooltip title="Inactivar Cliente">
                              <Button
                                icon={<StopOutlined />}
                                danger
                                onClick={() => handleStatusChange(client.id)}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Activar Cliente">
                              <Button
                                icon={<CheckOutlined />}
                                type="primary"
                                onClick={() => handleStatusChange(client.id)}
                              />
                            </Tooltip>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Text strong>Documento:</Text> {client.document}{" "}
                          <br />
                          <Text strong>Tipo de Persona:</Text>{" "}
                          {getPersonTypeLabel(client.personType)} <br />
                        </div>
                        <div>
                          {client.email && (
                            <>
                              <Text strong>Email:</Text> {client.email} <br />
                            </>
                          )}
                          {client.phone && (
                            <>
                              <Text strong>Teléfono:</Text> {client.phone}{" "}
                              <br />
                            </>
                          )}
                          {client.address && (
                            <>
                              <Text strong>Dirección:</Text> {client.address}
                            </>
                          )}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      <Modal
        title={selectedClient ? "Editar Cliente" : "Nuevo Cliente"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <ClientForm
          initialValues={selectedClient || undefined}
          onSubmit={selectedClient ? handleUpdateClient : handleCreateClient}
          onCancel={handleModalCancel}
          loading={formLoading}
          apiErrors={apiErrors}
        />
      </Modal>

      <Modal
        title="Detalles del Cliente"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        {selectedClient && (
          <div className="py-4">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Nombre" span={2}>
                {selectedClient.name}
              </Descriptions.Item>
              <Descriptions.Item label="Documento">
                {selectedClient.document}
              </Descriptions.Item>
              <Descriptions.Item label="Tipo de Persona">
                {getPersonTypeLabel(selectedClient.personType)}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedClient.email}
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {selectedClient.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección" span={2}>
                {selectedClient.address}
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                {getStatusTag(selectedClient.status)}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Información del Sistema</Divider>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">
                {selectedClient.id}
              </Descriptions.Item>

              <Descriptions.Item label="Fecha de Creación">
                {formatDate(selectedClient.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item label="Última Actualización">
                {formatDate(selectedClient.updatedAt)}
              </Descriptions.Item>

              <Descriptions.Item label="Fecha de Desactivación">
                {formatDate(selectedClient.deactivatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClientList;
