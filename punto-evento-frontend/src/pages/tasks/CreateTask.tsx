import { useState } from "react";
import Header from "../../components/Header/Header";
import type { TaskResponse } from "../../interfaces/task.interface";

const mockTasks: TaskResponse[] = [
  {
    id: "1",
    assignment_id: "a1",
    title: "Diseñar base de datos",
    description: "Crear esquema inicial de la base de datos del proyecto",
    created_at: "2024-06-01",
    updated_at: "2024-06-02",
  },
  {
    id: "2",
    assignment_id: "a1",
    title: "Implementar API",
    description: "Desarrollar el backend con Spring Boot",
    created_at: "2024-06-03",
    updated_at: "2024-06-04",
  },
];

const TaskList = () => {
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleViewDetail = (task: TaskResponse) => {
    setSelectedTask(task);
    setShowForm(false);
    setEditMode(false);
  };

  const handleEdit = (task: TaskResponse) => {
    setSelectedTask(task);
    setEditMode(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleDelete = (taskId: string) => {
    console.log("Eliminar tarea con ID:", taskId);
  };

  return (
      <div className="min-h-screen bg-gray-100">
        <Header isAuthenticated={true} onLogout={() => {}} />
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Tareas de la asignación</h1>

          <div className="mb-4">
            <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Nueva tarea
            </button>
          </div>

          <div className="bg-white rounded shadow p-4">
            <table className="w-full table-auto">
              <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-2">Título</th>
                <th className="py-2 px-2">Descripción</th>
                <th className="py-2 px-2">Acciones</th>
              </tr>
              </thead>
              <tbody>
              {mockTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="py-2 px-2">{task.title}</td>
                    <td className="py-2 px-2 text-gray-600">{task.description}</td>
                    <td className="py-2 px-2 space-x-2">
                      <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleViewDetail(task)}
                      >
                        Ver
                      </button>
                      <button
                          className="text-yellow-600 hover:underline"
                          onClick={() => handleEdit(task)}
                      >
                        Editar
                      </button>
                      <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(task.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {selectedTask && !editMode && (
              <div className="mt-6 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Detalle de la tarea</h2>
                <p>
                  <strong>Título:</strong> {selectedTask.title}
                </p>
                <p className="mt-1">
                  <strong>Descripción:</strong> {selectedTask.description || "Sin descripción"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Creada el: {selectedTask.created_at}
                </p>
              </div>
          )}

          {showForm && (
              <div className="mt-6 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">
                  {editMode ? "Editar tarea" : "Nueva tarea"}
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input
                        type="text"
                        defaultValue={editMode ? selectedTask?.title : ""}
                        className="mt-1 block w-full border px-3 py-2 rounded"
                        placeholder="Título de la tarea"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Descripción</label>
                    <textarea
                        defaultValue={editMode ? selectedTask?.description : ""}
                        className="mt-1 block w-full border px-3 py-2 rounded"
                        rows={3}
                        placeholder="Descripción de la tarea (opcional)"
                    />
                  </div>
                  <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    {editMode ? "Actualizar" : "Crear"}
                  </button>
                </form>
              </div>
          )}
        </div>
      </div>
  );
};

export default TaskList;
