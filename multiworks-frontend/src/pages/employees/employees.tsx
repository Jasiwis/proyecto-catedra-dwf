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
  EmployeeResponse,
  EmployeeDto,
} from "../../interfaces/employee.interface";
import { Status } from "../../enums/status.enum";
import { ContractType } from "../../enums/contract-type.enum";
import { PersonType } from "../../enums/person-type.enum";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { AxiosError } from "axios";
import { getAllEmployees } from "../../api/employee";
import EmployeeForm from "../../components/Forms/EmployeeForm";
import {
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "../../api/employee";

const { Title, Text } = Typography;

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailsModalVisible, setDetailsModalVisible] =
    useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeResponse | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { notification } = App.useApp();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [apiErrors, setApiErrors] = useState<
    Array<{ field: string; message: string }>
  >([]);

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

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Aquí deberías usar tu función getAllEmployees del API
      const response = await getAllEmployees();
      setEmployees(
        response.data.sort((a, b) => {
          if (a?.deactivatedAt && !b?.deactivatedAt) return 1;
          if (!a?.deactivatedAt && b?.deactivatedAt) return -1;
          return 0;
        })
      );
    } catch (error) {
      const err = error as AxiosError;
      showErrorNotification(
        "Error al cargar empleados",
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getStatusTag = (status?: Status) => {
    if (status === Status.Activo) return <Tag color="green">Activo</Tag>;
    if (status === Status.Inactivo) return <Tag color="red">Inactivo</Tag>;
    return <Tag>Desconocido</Tag>;
  };

  const getContractType = (type?: ContractType) => {
    switch (type) {
      case ContractType.Permanente:
        return "Permanente";
      case ContractType.PorHoras:
        return "Por horas";
      default:
        return "No especificado";
    }
  };

  const getPersonTypeLabel = (type: PersonType) => {
    return type === PersonType.Natural ? "Persona Natural" : "Persona Jurídica";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "No disponible";
    return format(date, "PPP 'a las' p", { locale: es });
  };

  const showModal = (employee?: EmployeeResponse) => {
    setSelectedEmployee(employee || null);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedEmployee(null);
  };

  const showEmployeeDetails = (employee: EmployeeResponse) => {
    setSelectedEmployee(employee);
    setDetailsModalVisible(true);
  };

  // Crear empleado
  const handleCreateEmployee = async (values: EmployeeDto) => {
    try {
      setFormLoading(true);
      setApiErrors([]);
      await createEmployee(values);
      showSuccessNotification(
        "Empleado Creado",
        `El empleado "${values.name}" ha sido creado exitosamente`
      );
      setModalVisible(false);
      fetchEmployees();
    } catch (err) {
      const error = err as AxiosError<{
        errors?: Array<{ field: string; message: string }>;
      }>;
      if (error.response?.data?.errors) {
        setApiErrors(error.response.data.errors);
        showErrorNotification(
          "Error de Validación",
          "Por favor, corrija los errores en el formulario"
        );
      } else {
        showErrorNotification(
          "Error al Crear Empleado",
          error instanceof Error ? error.message : "Error desconocido"
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Editar empleado
  const handleUpdateEmployee = async (values: EmployeeDto) => {
    if (!selectedEmployee) return;
    try {
      setFormLoading(true);
      setApiErrors([]);
      await updateEmployee(selectedEmployee.id, values);
      showSuccessNotification(
        "Empleado Actualizado",
        `El empleado "${values.name}" ha sido actualizado exitosamente`
      );
      setModalVisible(false);
      fetchEmployees();
    } catch (err) {
      const error = err as AxiosError<{
        errors?: Array<{ field: string; message: string }>;
      }>;
      if (error.response?.data?.errors) {
        setApiErrors(error.response.data.errors);
        showErrorNotification(
          "Error de Validación",
          "Por favor, corrija los errores en el formulario"
        );
      } else {
        showErrorNotification(
          "Error al Actualizar Empleado",
          error instanceof Error ? error.message : "Error desconocido"
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Activar/Inactivar empleado
  const handleStatusChange = async (employeeId: string) => {
    try {
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) return;
      await updateEmployeeStatus(employeeId);
      const newStatus =
        employee.status === Status.Activo ? "inactivado" : "activado";
      showSuccessNotification(
        "Estado Actualizado",
        `El empleado "${employee.name}" ha sido ${newStatus} exitosamente`
      );
      fetchEmployees();
    } catch (err) {
      const error = err as AxiosError;
      showErrorNotification(
        "Error al Cambiar Estado",
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
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
          <Title level={2}>Empleados</Title>
          <div className="space-x-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchEmployees}
              disabled={loading}
            >
              Recargar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Nuevo Empleado
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
              dataSource={employees}
              locale={{ emptyText: "No hay empleados registrados" }}
              renderItem={(employee) => (
                <List.Item
                  key={employee.id}
                  className="hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4"
                >
                  <List.Item.Meta
                    avatar={<UserOutlined className="text-2xl text-blue-500" />}
                    title={
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          {employee.name} {getStatusTag(employee.status)}
                        </span>
                        <Space>
                          <Tooltip title="Ver Detalle">
                            <Button
                              icon={<EyeOutlined />}
                              onClick={() => showEmployeeDetails(employee)}
                            />
                          </Tooltip>
                          <Tooltip title="Editar Empleado">
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => showModal(employee)}
                            />
                          </Tooltip>
                          {employee.status === Status.Activo ? (
                            <Tooltip title="Inactivar Empleado">
                              <Button
                                icon={<StopOutlined />}
                                danger
                                onClick={() => handleStatusChange(employee.id)}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Activar Empleado">
                              <Button
                                icon={<CheckOutlined />}
                                type="primary"
                                onClick={() => handleStatusChange(employee.id)}
                              />
                            </Tooltip>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Text strong>Documento:</Text> {employee.document}{" "}
                          <br />
                          <Text strong>Tipo de Persona:</Text>{" "}
                          {getPersonTypeLabel(employee.personType)} <br />
                          <Text strong>Tipo de Contrato:</Text>{" "}
                          {getContractType(employee.contractType)} <br />
                        </div>
                        <div>
                          {employee.email && (
                            <>
                              <Text strong>Email:</Text> {employee.email} <br />
                            </>
                          )}
                          {employee.phone && (
                            <>
                              <Text strong>Teléfono:</Text> {employee.phone}{" "}
                              <br />
                            </>
                          )}
                          {employee.address && (
                            <>
                              <Text strong>Dirección:</Text> {employee.address}
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

      {/* Modal de detalles */}
      <Modal
        title="Detalles del Empleado"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        {selectedEmployee && (
          <div className="py-4">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Nombre" span={2}>
                {selectedEmployee.name}
              </Descriptions.Item>
              <Descriptions.Item label="Documento">
                {selectedEmployee.document}
              </Descriptions.Item>
              <Descriptions.Item label="Tipo de Persona">
                {getPersonTypeLabel(selectedEmployee.personType)}
              </Descriptions.Item>
              <Descriptions.Item label="Tipo de Contrato">
                {getContractType(selectedEmployee.contractType)}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedEmployee.email}
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {selectedEmployee.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección" span={2}>
                {selectedEmployee.address}
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                {getStatusTag(selectedEmployee.status)}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Información del Sistema</Divider>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">
                {selectedEmployee.id}
              </Descriptions.Item>
              <Descriptions.Item label="Creado por">
                {selectedEmployee.createdBy}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Creación">
                {formatDate(selectedEmployee.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Última Actualización">
                {formatDate(selectedEmployee.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Desactivación">
                {formatDate(selectedEmployee.deactivatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Aquí irá el modal de formulario para crear/editar empleados */}
      <Modal
        title={selectedEmployee ? "Editar Empleado" : "Nuevo Empleado"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <EmployeeForm
          initialValues={selectedEmployee || undefined}
          onSubmit={
            selectedEmployee ? handleUpdateEmployee : handleCreateEmployee
          }
          onCancel={handleModalCancel}
          loading={formLoading}
          apiErrors={apiErrors}
        />
      </Modal>
    </div>
  );
};

export default EmployeeList;
