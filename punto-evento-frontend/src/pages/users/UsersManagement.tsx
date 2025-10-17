import React, { useState, useEffect } from "react";
import { UserType, UserTypeLabels } from "../../enums/user-type.enum";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../../interfaces/user.interface";
import { usersApi } from "../../api/users";
import UserForm from "../../components/Forms/UserForm";
import { Button } from "../../components/Buttons/Button";
import { getErrorFromResponse } from "../../utils/get-errror-from-response.util";

interface UsersManagementProps {}

const UsersManagement: React.FC<UsersManagementProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<UserType | "ALL">("ALL");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      if (selectedType === "ALL") {
        const response = await usersApi.getUsers(0, 100); // Cargar todos los usuarios
        setUsers(response.data.content);
      } else {
        const response = await usersApi.getUsersByType(selectedType);
        setUsers(response.data);
      }
    } catch (err) {
      setError(getErrorFromResponse(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [selectedType]);

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      setFormLoading(true);
      await usersApi.createUser(userData);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(getErrorFromResponse(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (userData: UpdateUserRequest) => {
    if (!editingUser) return;

    try {
      setFormLoading(true);
      await usersApi.updateUser(editingUser.id, userData);
      setShowForm(false);
      setEditingUser(undefined);
      loadUsers();
    } catch (err) {
      setError(getErrorFromResponse(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      return;
    }

    try {
      await usersApi.deleteUser(userId);
      loadUsers();
    } catch (err) {
      setError(getErrorFromResponse(err));
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm("¿Está seguro de que desea desactivar este usuario?")) {
      return;
    }

    try {
      await usersApi.deactivateUser(userId);
      loadUsers();
    } catch (err) {
      setError(getErrorFromResponse(err));
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={handleCancelForm}
            isLoading={formLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Crear Usuario
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="typeFilter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filtrar por tipo de usuario:
          </label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as UserType | "ALL")
            }
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos los usuarios</option>
            {Object.values(UserType).map((type) => (
              <option key={type} value={type}>
                {UserTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {UserTypeLabels[user.userType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Editar
                      </Button>
                      {user.active && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          Desactivar
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
