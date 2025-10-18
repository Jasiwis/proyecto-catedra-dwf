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
} from "antd";
import { EyeOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { reservationsApi } from "../../api/reservations";

interface ReservationData {
  id: string;
  quoteId?: string;
  eventName: string;
  scheduledFor: string;
  location: string;
  status: string;
  progressPercentage: number;
  createdAt: string;
  quoteTotal?: number;
}

const ClientReservations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<any[]>([]);

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
          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
          : undefined,
        dateTo: dateRange?.[1]
          ? dayjs(dateRange[1]).format("YYYY-MM-DD")
          : undefined,
      });
      const data = (response?.data || []).map((r: any) => ({
        id: r.id,
        quoteId: r.quote?.id,
        eventName: r.eventName || "Sin nombre",
        scheduledFor: r.scheduledFor,
        location: r.location,
        status: String(r.status).toUpperCase(),
        progressPercentage: Number(r.progressPercentage || 0),
        createdAt: r.createdAt,
        quoteTotal: r.quote?.total,
      }));
      setReservations(data);
    } catch (error) {
      message.error("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const showReservationDetails = (reservation: ReservationData) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
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
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a: ReservationData, b: ReservationData) =>
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
      filters: [
        { text: "Activo", value: "ACTIVO" },
        { text: "Inactivo", value: "INACTIVO" },
      ],
      onFilter: (value: string, record: ReservationData) =>
        String(record.status).toUpperCase() === String(value).toUpperCase(),
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
            percent={p}
            size="small"
            status={p === 100 ? "success" : "active"}
          />
        </div>
      ),
      sorter: (a: ReservationData, b: ReservationData) =>
        a.progressPercentage - b.progressPercentage,
    },
    {
      title: "Creada",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a: ReservationData, b: ReservationData) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: ReservationData) => (
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
                value={dateRange as any}
                onChange={(val) => setDateRange(val as any)}
              />
              <Button onClick={fetchReservations} type="primary">
                Buscar
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText("");
                  setStatusFilter(undefined);
                  setDateRange([]);
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
          footer={[
            <Button key="close" onClick={() => setModalVisible(false)}>
              Cerrar
            </Button>,
          ]}
        >
          {selectedReservation && (
            <div className="space-y-4">
              <Descriptions
                bordered
                column={2}
                title="Información de la Reserva"
              >
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
                {selectedReservation.quoteTotal && (
                  <Descriptions.Item label="Total Cotizado">
                    <span className="font-semibold text-green-600">
                      ${Number(selectedReservation.quoteTotal).toFixed(2)}
                    </span>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Progreso" span={2}>
                  <Progress
                    percent={selectedReservation.progressPercentage}
                    status={
                      selectedReservation.progressPercentage === 100
                        ? "success"
                        : "active"
                    }
                  />
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ClientReservations;
