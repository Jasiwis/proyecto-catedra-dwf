import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Descriptions,
  Progress,
  Input,
  Select,
  DatePicker,
  Divider,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { reservationsApi } from "../../api/reservations";
import type { ReservationDetail } from "../../api/reservations";
import { formatDateTimeToSpanish } from "../../utils/date-formatter.util";

const ClientReservations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationDetail[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetail | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsApi.getMyReservations({
        q: searchText || undefined,
        status: statusFilter,
        dateFrom: dateRange?.[0]
          ? dateRange[0].format("YYYY-MM-DD")
          : undefined,
        dateTo: dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : undefined,
      });
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

  const handleCancelReservation = async (reservationId: string) => {
    try {
      setLoading(true);

      const response = await reservationsApi.cancelReservation(reservationId);

      if (response.success) {
        message.success("Reservación cancelada exitosamente");

        // Actualizar la vista del modal si está abierta
        if (selectedReservation?.id === reservationId) {
          const detailResponse = await reservationsApi.getReservationById(
            reservationId
          );
          if (detailResponse.success && detailResponse.data) {
            setSelectedReservation(detailResponse.data);
          }
        }

        // Recargar todas las reservaciones
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
    const normalized = String(status).toUpperCase();
    switch (normalized) {
      case "EN_PLANEACION":
      case "ENPLANEACION":
        return "cyan";
      case "PROGRAMADA":
      case "ACTIVO":
        return "blue";
      case "EN_CURSO":
      case "ENCURSO":
        return "orange";
      case "FINALIZADA":
      case "INACTIVO":
        return "green";
      case "CANCELADA":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    const normalized = String(status).toUpperCase();
    switch (normalized) {
      case "EN_PLANEACION":
      case "ENPLANEACION":
        return "En Planeación";
      case "PROGRAMADA":
      case "ACTIVO":
        return "Programada";
      case "EN_CURSO":
      case "ENCURSO":
        return "En Curso";
      case "FINALIZADA":
      case "INACTIVO":
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
      title: "Nombre del Evento",
      dataIndex: "eventName",
      key: "eventName",
      ellipsis: true,
    },
    {
      title: "Fecha Programada",
      dataIndex: "scheduledFor",
      key: "scheduledFor",
      render: (date: string) => formatDateTimeToSpanish(date),
      sorter: (a: ReservationDetail, b: ReservationDetail) =>
        dayjs(a.scheduledFor).unix() - dayjs(b.scheduledFor).unix(),
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
      render: (p: number) => (
        <div className="w-24">
          <Progress
            percent={Number(p || 0)}
            size="small"
            status={Number(p || 0) === 100 ? "success" : "active"}
          />
        </div>
      ),
      sorter: (a: ReservationDetail, b: ReservationDetail) =>
        Number(a.progressPercentage || 0) - Number(b.progressPercentage || 0),
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
      title: "Creada",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDateTimeToSpanish(date),
      sorter: (a: ReservationDetail, b: ReservationDetail) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
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
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Consulta y monitorea tus reservas y el progreso de tus eventos
          </p>
        </div>

        <Card
          title="Reservas"
          extra={
            <Space>
              <Input
                allowClear
                placeholder="Buscar..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 220 }}
              />
              <Select
                allowClear
                placeholder="Estado"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v)}
                options={[
                  { label: "Activo", value: "ACTIVO" },
                  { label: "Inactivo", value: "INACTIVO" },
                ]}
                style={{ width: 160 }}
              />
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(val) =>
                  setDateRange(val as [dayjs.Dayjs, dayjs.Dayjs] | null)
                }
              />
              <Button onClick={fetchReservations} type="primary">
                Buscar
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText("");
                  setStatusFilter(undefined);
                  setDateRange(null);
                  fetchReservations();
                }}
              />
            </Space>
          }
        >
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={reservations}
              rowKey="id"
              loading={loading}
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </div>
        </Card>

        <Modal
          title="Detalles de la Reserva"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={900}
          footer={
            String(selectedReservation?.status).toUpperCase() === "CANCELADA" ||
            String(selectedReservation?.status).toUpperCase() === "FINALIZADA"
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
                bordered
                column={2}
                title="Información de la Reserva"
              >
                <Descriptions.Item label="Nombre del Evento" span={2}>
                  {selectedReservation.eventName}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha Programada">
                  {formatDateTimeToSpanish(selectedReservation.scheduledFor)}
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
                  {formatDateTimeToSpanish(selectedReservation.createdAt)}
                </Descriptions.Item>
                {selectedReservation.notes && (
                  <Descriptions.Item label="Notas" span={2}>
                    {selectedReservation.notes}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Progreso" span={2}>
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

              {/* Tareas del Evento - Solo visible si NO está en EN_PLANEACION */}
              {String(selectedReservation.status).toUpperCase() !==
                "EN_PLANEACION" &&
              String(selectedReservation.status).toUpperCase() !==
                "ENPLANEACION" ? (
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
                            date ? formatDateTimeToSpanish(date) : "-",
                        },
                        {
                          title: "Fecha Fin",
                          dataIndex: "endDatetime",
                          key: "endDatetime",
                          render: (date: string) =>
                            date ? formatDateTimeToSpanish(date) : "-",
                        },
                      ]}
                    />
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No hay tareas asignadas aún
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center bg-blue-50 p-6 rounded-lg">
                  <div className="text-blue-600 font-semibold mb-2">
                    Evento en Planeación
                  </div>
                  <div className="text-gray-600">
                    Este evento está siendo planificado por nuestro equipo. Las
                    tareas serán visibles una vez que el evento sea publicado.
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ClientReservations;
