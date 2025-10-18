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
  Divider,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { reservationsApi } from "../../api/reservations";
import { tasksApi } from "../../api/task";
import { getAllEmployees } from "../../api/employee";
import type { ReservationDetail } from "../../api/reservations";
import type { EmployeeResponse } from "../../interfaces/employee.interface";

const AdminReservations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationDetail[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetail | null>(null);
  const [taskForm] = Form.useForm();

  useEffect(() => {
    fetchReservations();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      // Filtrar solo empleados activos
      const activeEmployees =
        response?.data?.filter((emp) => emp.status === "Activo") || [];
      setEmployees(activeEmployees);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsApi.getAllReservations();
      setReservations(response?.data || []);
    } catch (error) {
      message.error("Error al cargar las reservas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showReservationDetails = (reservation: ReservationDetail) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  const handleAddTask = () => {
    if (selectedReservation) {
      setTaskModalVisible(true);
      taskForm.resetFields();
    }
  };

  const handleCreateTask = async () => {
    try {
      const values = await taskForm.validateFields();
      setLoading(true);

      await tasksApi.createTask({
        reservationId: selectedReservation!.id,
        title: values.title,
        description: values.description,
        employeeId: values.employeeId,
        startDatetime: values.startDatetime.format("YYYY-MM-DDTHH:mm:ss"),
        endDatetime: values.endDatetime.format("YYYY-MM-DDTHH:mm:ss"),
        serviceId: undefined,
      });

      message.success("Tarea creada exitosamente");
      setTaskModalVisible(false);
      taskForm.resetFields();

      // Recargar la reservación seleccionada con los datos actualizados
      if (selectedReservation) {
        const response = await reservationsApi.getReservationById(
          selectedReservation.id
        );
        if (response.success && response.data) {
          setSelectedReservation(response.data);
        }
      }

      // Recargar todas las reservaciones en segundo plano
      fetchReservations();
    } catch (error) {
      message.error("Error al crear la tarea");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishReservation = async (reservationId: string) => {
    try {
      setLoading(true);
      await reservationsApi.publishReservation(reservationId);
      message.success(
        "Reservación publicada exitosamente. Ahora está PROGRAMADA y visible para el cliente."
      );

      // Recargar la reservación seleccionada con los datos actualizados
      const response = await reservationsApi.getReservationById(reservationId);
      if (response.success && response.data) {
        setSelectedReservation(response.data);
      }

      // Recargar todas las reservaciones en segundo plano
      fetchReservations();
    } catch (error) {
      message.error("Error al publicar la reservación");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      setLoading(true);

      const response = await reservationsApi.cancelReservation(reservationId);

      if (response.success) {
        message.success("Reservación cancelada exitosamente");

        // Recargar la reservación seleccionada con los datos actualizados
        const detailResponse = await reservationsApi.getReservationById(
          reservationId
        );
        if (detailResponse.success && detailResponse.data) {
          setSelectedReservation(detailResponse.data);
        }

        // Recargar todas las reservaciones en segundo plano
        fetchReservations();
      } else {
        message.error(response.message || "Error al cancelar la reservación");
      }
    } catch (error) {
      let errorMessage = "Error al cancelar la reservación";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_PLANEACION":
        return "cyan";
      case "PROGRAMADA":
        return "blue";
      case "EN_CURSO":
        return "orange";
      case "FINALIZADA":
        return "green";
      case "CANCELADA":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "EN_PLANEACION":
        return "En Planeación";
      case "PROGRAMADA":
        return "Programada";
      case "EN_CURSO":
        return "En Curso";
      case "FINALIZADA":
        return "Finalizada";
      case "CANCELADA":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getTaskStatusColor = (status: string) => {
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

  const getTaskStatusLabel = (status: string) => {
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
      title: "Cliente",
      dataIndex: ["client", "name"],
      key: "clientName",
      render: (_: unknown, record: ReservationDetail) =>
        record.client?.name || "Cliente no disponible",
    },
    {
      title: "Nombre del Evento",
      dataIndex: "eventName",
      key: "eventName",
      ellipsis: true,
    },
    {
      title: "Fecha del Evento",
      dataIndex: "scheduledFor",
      key: "scheduledFor",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ubicación",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
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
      title: "Progreso",
      dataIndex: "progressPercentage",
      key: "progressPercentage",
      render: (percentage: number) => (
        <div className="w-24">
          <Progress
            percent={Number(percentage || 0)}
            size="small"
            status={Number(percentage || 0) === 100 ? "success" : "active"}
          />
        </div>
      ),
    },
    {
      title: "Tareas",
      key: "tasks",
      render: (_: unknown, record: ReservationDetail) => {
        const completedTasks =
          record.tasks?.filter((t) => t.status === "COMPLETADA").length || 0;
        const totalTasks = record.tasks?.length || 0;
        return (
          <span>
            {completedTasks} / {totalTasks}
          </span>
        );
      },
    },
    {
      title: "Fecha de Reserva",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: ReservationDetail) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showReservationDetails(record)}
          >
            Ver Detalles
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Reservas
          </h1>
          <p className="text-gray-600">
            Monitorea el progreso de todas las reservas y eventos
          </p>
        </div>

        {/* Resumen de Reservas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">
                {
                  reservations.filter(
                    (r) =>
                      String(r.status).toUpperCase() === "EN_PLANEACION" ||
                      String(r.status).toUpperCase() === "ENPLANEACION"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">En Planeación</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  reservations.filter(
                    (r) =>
                      String(r.status).toUpperCase() === "PROGRAMADA" ||
                      String(r.status).toUpperCase() === "ACTIVO"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Programadas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {
                  reservations.filter(
                    (r) =>
                      String(r.status).toUpperCase() === "EN_CURSO" ||
                      String(r.status).toUpperCase() === "ENCURSO"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">En Curso</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  reservations.filter(
                    (r) =>
                      String(r.status).toUpperCase() === "FINALIZADA" ||
                      String(r.status).toUpperCase() === "INACTIVO"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Finalizadas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {reservations.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </Card>
        </div>

        <Card title="Lista de Reservas">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={reservations}
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

        {/* Modal de Detalles de Reserva */}
        <Modal
          title={`Detalles de la Reserva - ${
            selectedReservation?.client?.name || "Cliente"
          }`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={900}
          footer={
            String(selectedReservation?.status).toUpperCase() ===
              "EN_PLANEACION" ||
            String(selectedReservation?.status).toUpperCase() === "ENPLANEACION"
              ? [
                  <Button
                    key="addTask"
                    type="default"
                    icon={<PlusOutlined />}
                    onClick={handleAddTask}
                  >
                    Agregar Tarea
                  </Button>,
                  <Button
                    key="publish"
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() =>
                      handlePublishReservation(selectedReservation!.id)
                    }
                    disabled={
                      !selectedReservation?.tasks ||
                      selectedReservation.tasks.length === 0
                    }
                  >
                    Publicar Reservación
                  </Button>,
                  <Button
                    key="cancel"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelReservation(selectedReservation!.id);
                    }}
                  >
                    Cancelar Reservación
                  </Button>,
                  <Button key="close" onClick={() => setModalVisible(false)}>
                    Cerrar
                  </Button>,
                ]
              : String(selectedReservation?.status).toUpperCase() ===
                  "CANCELADA" ||
                String(selectedReservation?.status).toUpperCase() ===
                  "FINALIZADA"
              ? [
                  <Button key="close" onClick={() => setModalVisible(false)}>
                    Cerrar
                  </Button>,
                ]
              : [
                  <Button
                    key="cancel"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelReservation(selectedReservation!.id);
                    }}
                  >
                    Cancelar Reservación
                  </Button>,
                  <Button key="close" onClick={() => setModalVisible(false)}>
                    Cerrar
                  </Button>,
                ]
          }
        >
          {selectedReservation && (
            <div className="space-y-6">
              {/* Información de la Reserva */}
              <Descriptions
                title="Información de la Reserva"
                bordered
                column={2}
              >
                <Descriptions.Item label="Cliente">
                  {selectedReservation.client?.name || "Cliente no disponible"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedReservation.client?.email || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nombre del Evento" span={2}>
                  {selectedReservation.eventName}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha Programada">
                  {dayjs(selectedReservation.scheduledFor).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación">
                  {selectedReservation.location}
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Tag color={getStatusColor(selectedReservation.status)}>
                    {getStatusLabel(selectedReservation.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Creada">
                  {dayjs(selectedReservation.createdAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </Descriptions.Item>
                {selectedReservation.notes && (
                  <Descriptions.Item label="Notas" span={2}>
                    {selectedReservation.notes}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Progreso General" span={2}>
                  <Progress
                    percent={Number(
                      selectedReservation.progressPercentage || 0
                    )}
                    status={
                      Number(selectedReservation.progressPercentage || 0) ===
                      100
                        ? "success"
                        : "active"
                    }
                  />
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              {/* Información de la Cotización */}
              {selectedReservation.quote && (
                <>
                  <Descriptions
                    bordered
                    column={2}
                    title="Información de la Cotización"
                  >
                    <Descriptions.Item label="Nombre del Servicio" span={2}>
                      {selectedReservation.quote.eventName}
                    </Descriptions.Item>
                    {selectedReservation.quote.estimatedHours && (
                      <Descriptions.Item label="Horas Estimadas">
                        {selectedReservation.quote.estimatedHours}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Estado de Cotización">
                      <Tag color="green">
                        {selectedReservation.quote.status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Subtotal">
                      $
                      {Number(selectedReservation.quote.subtotal || 0).toFixed(
                        2
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Impuestos">
                      $
                      {Number(selectedReservation.quote.taxTotal || 0).toFixed(
                        2
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Costos Adicionales">
                      $
                      {Number(
                        selectedReservation.quote.additionalCosts || 0
                      ).toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total">
                      <span className="font-semibold text-green-600 text-lg">
                        $
                        {Number(selectedReservation.quote.total || 0).toFixed(
                          2
                        )}
                      </span>
                    </Descriptions.Item>
                  </Descriptions>

                  {/* Servicios de la Cotización */}
                  {selectedReservation.services &&
                    selectedReservation.services.length > 0 && (
                      <>
                        <Divider />
                        <div>
                          <h4 className="text-lg font-semibold mb-3">
                            Servicios Incluidos
                          </h4>
                          <Table
                            dataSource={selectedReservation.services}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            columns={[
                              {
                                title: "Descripción",
                                dataIndex: "description",
                                key: "description",
                              },
                              {
                                title: "Cantidad",
                                dataIndex: "quantity",
                                key: "quantity",
                              },
                              {
                                title: "Precio Unitario",
                                dataIndex: "unitPrice",
                                key: "unitPrice",
                                render: (price: number) =>
                                  `$${Number(price || 0).toFixed(2)}`,
                              },
                              {
                                title: "Total",
                                dataIndex: "total",
                                key: "total",
                                render: (total: number) => (
                                  <span className="font-semibold">
                                    ${Number(total || 0).toFixed(2)}
                                  </span>
                                ),
                              },
                            ]}
                          />
                        </div>
                      </>
                    )}
                </>
              )}

              <Divider />

              {/* Tareas del Evento */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Tareas del Evento ({selectedReservation.tasks?.length || 0})
                </h4>
                {selectedReservation.tasks &&
                selectedReservation.tasks.length > 0 ? (
                  <Table
                    dataSource={selectedReservation.tasks}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Tarea",
                        dataIndex: "title",
                        key: "title",
                      },
                      {
                        title: "Descripción",
                        dataIndex: "description",
                        key: "description",
                        render: (desc: string) => desc || "-",
                      },
                      {
                        title: "Asignada a",
                        dataIndex: "employeeName",
                        key: "employeeName",
                        render: (name: string) => name || "Sin asignar",
                      },
                      {
                        title: "Estado",
                        dataIndex: "status",
                        key: "status",
                        render: (status: string) => (
                          <Tag color={getTaskStatusColor(status)}>
                            {getTaskStatusLabel(status)}
                          </Tag>
                        ),
                      },
                      {
                        title: "Fecha Inicio",
                        dataIndex: "startDatetime",
                        key: "startDatetime",
                        render: (date: string) =>
                          date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-",
                      },
                      {
                        title: "Fecha Fin",
                        dataIndex: "endDatetime",
                        key: "endDatetime",
                        render: (date: string) =>
                          date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-",
                      },
                    ]}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No hay tareas asignadas aún
                  </div>
                )}
              </div>

              {/* Timeline de la Reserva */}
              <Divider />
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Historial de la Reserva
                </h4>
                <Timeline
                  items={[
                    {
                      color: "blue",
                      children: (
                        <div>
                          <div className="font-semibold">Reserva Creada</div>
                          <div className="text-sm text-gray-500">
                            {dayjs(selectedReservation.createdAt).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: "orange",
                      children: (
                        <div>
                          <div className="font-semibold">Tareas Asignadas</div>
                          <div className="text-sm text-gray-500">
                            {selectedReservation.tasks?.length || 0} tareas
                            asignadas
                          </div>
                        </div>
                      ),
                    },
                    ...(String(selectedReservation.status).toUpperCase() ===
                      "EN_CURSO" ||
                    String(selectedReservation.status).toUpperCase() ===
                      "ENCURSO" ||
                    String(selectedReservation.status).toUpperCase() ===
                      "FINALIZADA" ||
                    String(selectedReservation.status).toUpperCase() ===
                      "INACTIVO"
                      ? [
                          {
                            color: "orange",
                            children: (
                              <div>
                                <div className="font-semibold">
                                  Evento Iniciado
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dayjs(
                                    selectedReservation.scheduledFor
                                  ).format("DD/MM/YYYY HH:mm")}
                                </div>
                              </div>
                            ),
                          },
                        ]
                      : []),
                    ...(String(selectedReservation.status).toUpperCase() ===
                      "FINALIZADA" ||
                    String(selectedReservation.status).toUpperCase() ===
                      "INACTIVO"
                      ? [
                          {
                            color: "green",
                            children: (
                              <div>
                                <div className="font-semibold">
                                  Evento Finalizado
                                </div>
                                <div className="text-sm text-gray-500">
                                  Todas las tareas completadas
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

        {/* Modal para Crear Tarea */}
        <Modal
          title="Agregar Nueva Tarea"
          open={taskModalVisible}
          onCancel={() => {
            setTaskModalVisible(false);
            taskForm.resetFields();
          }}
          onOk={handleCreateTask}
          confirmLoading={loading}
          okText="Crear Tarea"
          cancelText="Cancelar"
          width={600}
        >
          <Form form={taskForm} layout="vertical">
            <Form.Item
              name="title"
              label="Título de la Tarea"
              rules={[
                { required: true, message: "Por favor ingrese el título" },
                {
                  min: 3,
                  message: "El título debe tener al menos 3 caracteres",
                },
              ]}
            >
              <Input placeholder="Ej: Preparar decoración del evento" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Descripción"
              rules={[
                {
                  max: 500,
                  message: "La descripción no debe exceder los 500 caracteres",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Describe los detalles de la tarea..."
              />
            </Form.Item>

            <Form.Item
              name="employeeId"
              label="Asignar a Empleado"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione un empleado",
                },
              ]}
            >
              <Select
                placeholder="Seleccione un empleado"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={employees.map((emp) => ({
                  label: `${emp.name}`,
                  value: emp.id,
                }))}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="startDatetime"
                label="Fecha de Inicio"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione la fecha de inicio",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (value.isBefore(dayjs())) {
                        return Promise.reject(
                          new Error("La fecha no puede ser en el pasado")
                        );
                      }
                      if (
                        selectedReservation?.scheduledFor &&
                        value.isAfter(dayjs(selectedReservation.scheduledFor))
                      ) {
                        return Promise.reject(
                          new Error("La fecha no puede ser posterior al evento")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Seleccione fecha y hora"
                  className="w-full"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>

              <Form.Item
                name="endDatetime"
                label="Fecha de Fin"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione la fecha de fin",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const startDate = taskForm.getFieldValue("startDatetime");
                      if (startDate && value.isBefore(startDate)) {
                        return Promise.reject(
                          new Error(
                            "La fecha de fin debe ser mayor o igual a la de inicio"
                          )
                        );
                      }
                      if (
                        selectedReservation?.scheduledFor &&
                        value.isAfter(dayjs(selectedReservation.scheduledFor))
                      ) {
                        return Promise.reject(
                          new Error("La fecha no puede ser posterior al evento")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Seleccione fecha y hora"
                  className="w-full"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              <div className="mb-1">
                <strong>Evento programado para:</strong>{" "}
                {selectedReservation?.scheduledFor
                  ? dayjs(selectedReservation.scheduledFor).format(
                      "DD/MM/YYYY HH:mm"
                    )
                  : "No especificado"}
              </div>
              <div>
                * La tarea se creará en estado PENDIENTE y será asignada al
                empleado seleccionado.
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminReservations;
