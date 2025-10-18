import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Form,
  Input,
  Select,
  Popconfirm,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  usersApi,
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
} from "../../api/users";
import { getErrorFromResponse } from "../../utils/get-errror-from-response.util";
import { useAuth } from "../../hooks/use-auth";

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers(true); // Carga inicial con loading

    // Auto-refresh cada 30 segundos para actualizaciones en tiempo real
    const interval = setInterval(() => {
      fetchUsers(false); // Refresh silencioso sin loading
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterData();
  }, [users, searchText, filterType, filterStatus]);

  const fetchUsers = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const response = await usersApi.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      // Solo mostrar error si no es un refresh automático
      if (showLoading) {
        message.error(`Error al cargar usuarios: ${errorMessage}`);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const filterData = () => {
    let filtered = [...users];

    // Filtro de búsqueda
    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por tipo de usuario
    if (filterType !== "ALL") {
      filtered = filtered.filter((user) => user.userType === filterType);
    }

    // Filtro por estado
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((user) =>
        filterStatus === "ACTIVE" ? user.active : !user.active
      );
    }

    setFilteredUsers(filtered);
  };

  const showCreateModal = () => {
    setEditMode(false);
    setSelectedUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (user: User) => {
    setEditMode(true);
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      userType: user.userType,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editMode && selectedUser) {
        // Actualizar usuario (sin campo active, se usa el botón Desactivar)
        const updateData: UpdateUserRequest = {
          name: values.name,
          email: values.email,
          userType: values.userType,
        };

        // Solo incluir password si se proporcionó uno nuevo
        if (values.password && values.password.trim() !== "") {
          updateData.password = values.password;
        }

        await usersApi.updateUser(selectedUser.id, updateData);
        message.success("Usuario actualizado exitosamente");
      } else {
        // Crear usuario (por defecto se crea activo)
        const createData: CreateUserRequest = {
          name: values.name,
          email: values.email,
          password: values.password,
          userType: values.userType,
          active: true, // Por defecto activo
        };

        await usersApi.createUser(createData);
        message.success("Usuario creado exitosamente");
      }

      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(
        `Error al ${editMode ? "actualizar" : "crear"} usuario: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await usersApi.deleteUser(id);
      message.success("Usuario eliminado exitosamente");
      fetchUsers();
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(`Error al eliminar usuario: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      setLoading(true);
      await usersApi.deactivateUser(id);
      message.success("Usuario desactivado exitosamente");
      fetchUsers();
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(`Error al desactivar usuario: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      setLoading(true);
      await usersApi.updateUser(id, { active: true });
      message.success("Usuario activado exitosamente");
      fetchUsers();
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(`Error al activar usuario: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "ADMIN":
        return "red";
      case "EMPLOYEE":
        return "blue";
      case "CLIENT":
        return "green";
      default:
        return "default";
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "ADMIN":
        return "Administrador";
      case "EMPLOYEE":
        return "Empleado";
      case "CLIENT":
        return "Cliente";
      default:
        return type;
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterSearch: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Tipo",
      dataIndex: "userType",
      key: "userType",
      render: (type: string) => (
        <Tag color={getUserTypeColor(type)}>{getUserTypeLabel(type)}</Tag>
      ),
      filters: [
        { text: "Administrador", value: "ADMIN" },
        { text: "Empleado", value: "EMPLOYEE" },
        { text: "Cliente", value: "CLIENT" },
      ],
      onFilter: (value, record) => record.userType === value,
    },
    {
      title: "Estado",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Activo" : "Inactivo"}
        </Tag>
      ),
      filters: [
        { text: "Activo", value: true },
        { text: "Inactivo", value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: "Fecha Creación",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString("es-ES"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: User) => {
        const isCurrentUser = currentUser?.id === record.id;

        return (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            >
              Editar
            </Button>
            {record.active ? (
              <Popconfirm
                title={
                  isCurrentUser
                    ? "No puedes desactivar tu propio usuario"
                    : "¿Estás seguro de desactivar este usuario?"
                }
                onConfirm={() => handleDeactivate(record.id)}
                okText="Sí"
                cancelText="No"
                disabled={isCurrentUser}
              >
                <Button
                  type="link"
                  icon={<StopOutlined />}
                  danger
                  disabled={isCurrentUser}
                  title={
                    isCurrentUser
                      ? "No puedes desactivar tu propio usuario"
                      : ""
                  }
                >
                  Desactivar
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="¿Estás seguro de activar este usuario?"
                onConfirm={() => handleActivate(record.id)}
                okText="Sí"
                cancelText="No"
              >
                <Button
                  type="link"
                  icon={<CheckCircleOutlined />}
                  style={{ color: "#52c41a" }}
                >
                  Activar
                </Button>
              </Popconfirm>
            )}
            <Popconfirm
              title={
                isCurrentUser
                  ? "No puedes eliminar tu propio usuario"
                  : "¿Estás seguro de eliminar este usuario?"
              }
              description={
                isCurrentUser ? undefined : "Esta acción no se puede deshacer."
              }
              onConfirm={() => handleDelete(record.id)}
              okText="Sí"
              cancelText="No"
              disabled={isCurrentUser}
            >
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                disabled={isCurrentUser}
                title={
                  isCurrentUser ? "No puedes eliminar tu propio usuario" : ""
                }
              >
                Eliminar
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const onChange: TableProps<User>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.length}
              </div>
              <div className="text-sm text-gray-600">Total Usuarios</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.userType === "ADMIN").length}
              </div>
              <div className="text-sm text-gray-600">Administradores</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter((u) => u.userType === "EMPLOYEE").length}
              </div>
              <div className="text-sm text-gray-600">Empleados</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.userType === "CLIENT").length}
              </div>
              <div className="text-sm text-gray-600">Clientes</div>
            </div>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input
                placeholder="Buscar por nombre o email..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuario
              </label>
              <Select
                value={filterType}
                onChange={setFilterType}
                className="w-full"
              >
                <Select.Option value="ALL">Todos</Select.Option>
                <Select.Option value="ADMIN">Administrador</Select.Option>
                <Select.Option value="EMPLOYEE">Empleado</Select.Option>
                <Select.Option value="CLIENT">Cliente</Select.Option>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                className="w-full"
              >
                <Select.Option value="ALL">Todos</Select.Option>
                <Select.Option value="ACTIVE">Activos</Select.Option>
                <Select.Option value="INACTIVE">Inactivos</Select.Option>
              </Select>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Nuevo Usuario
            </Button>
          </div>
        </Card>

        {/* Tabla */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            onChange={onChange}
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} usuarios`,
            }}
          />
        </Card>

        {/* Modal Crear/Editar */}
        <Modal
          title={editMode ? "Editar Usuario" : "Crear Usuario"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          onOk={handleSubmit}
          confirmLoading={loading}
          okText={editMode ? "Actualizar" : "Crear"}
          cancelText="Cancelar"
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Nombre Completo"
              rules={[
                { required: true, message: "El nombre es obligatorio" },
                {
                  min: 2,
                  max: 100,
                  message: "El nombre debe tener entre 2 y 100 caracteres",
                },
              ]}
            >
              <Input placeholder="Ej: Juan Pérez" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "El email es obligatorio" },
                { type: "email", message: "El formato del email no es válido" },
              ]}
            >
              <Input placeholder="ejemplo@correo.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                editMode
                  ? "Contraseña (dejar en blanco para no cambiar)"
                  : "Contraseña"
              }
              rules={
                editMode
                  ? [
                      {
                        min: 6,
                        message:
                          "La contraseña debe tener al menos 6 caracteres",
                      },
                    ]
                  : [
                      {
                        required: true,
                        message: "La contraseña es obligatoria",
                      },
                      {
                        min: 6,
                        message:
                          "La contraseña debe tener al menos 6 caracteres",
                      },
                    ]
              }
            >
              <Input.Password placeholder="Mínimo 6 caracteres" />
            </Form.Item>

            <Form.Item
              name="userType"
              label="Tipo de Usuario"
              rules={[
                {
                  required: true,
                  message: "El tipo de usuario es obligatorio",
                },
              ]}
            >
              <Select placeholder="Seleccione un tipo">
                <Select.Option value="ADMIN">Administrador</Select.Option>
                <Select.Option value="EMPLOYEE">Empleado</Select.Option>
                <Select.Option value="CLIENT">Cliente</Select.Option>
              </Select>
            </Form.Item>

            {editMode && (
              <div className="text-sm text-gray-500 mt-3">
                * Para cambiar el estado del usuario, usa los botones
                "Activar/Desactivar" en la tabla
              </div>
            )}
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
