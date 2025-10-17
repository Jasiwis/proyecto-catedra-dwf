import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Table,
  Tag,
  Space,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface DashboardStats {
  totalRequests: number;
  pendingQuotes: number;
  approvedQuotes: number;
  activeReservations: number;
  completedReservations: number;
  totalRevenue: number;
  totalClients: number;
  totalEmployees: number;
}

interface RecentActivity {
  id: string;
  type: "request" | "quote" | "reservation";
  description: string;
  clientName: string;
  status: string;
  date: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingQuotes: 0,
    approvedQuotes: 0,
    activeReservations: 0,
    completedReservations: 0,
    totalRevenue: 0,
    totalClients: 0,
    totalEmployees: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Aquí harías las llamadas a la API para obtener los datos del dashboard
      // const [statsRes, activityRes] = await Promise.all([
      //   getDashboardStats(),
      //   getRecentActivity()
      // ]);

      // Datos de ejemplo
      setStats({
        totalRequests: 25,
        pendingQuotes: 8,
        approvedQuotes: 12,
        activeReservations: 15,
        completedReservations: 35,
        totalRevenue: 125000,
        totalClients: 45,
        totalEmployees: 8,
      });

      setRecentActivity([
        {
          id: "1",
          type: "request",
          description: "Nueva solicitud de evento corporativo",
          clientName: "Juan Pérez",
          status: "PENDIENTE",
          date: "2024-10-17T10:30:00Z",
        },
        {
          id: "2",
          type: "quote",
          description: "Cotización aprobada para boda",
          clientName: "María Rodríguez",
          status: "APROBADA",
          date: "2024-10-17T09:15:00Z",
        },
        {
          id: "3",
          type: "reservation",
          description: "Reserva creada para evento de fin de año",
          clientName: "Empresa Ejemplo",
          status: "ACTIVA",
          date: "2024-10-16T16:45:00Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "request":
        return <FileTextOutlined className="text-blue-500" />;
      case "quote":
        return <CheckCircleOutlined className="text-green-500" />;
      case "reservation":
        return <CalendarOutlined className="text-purple-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "orange";
      case "APROBADA":
        return "green";
      case "ACTIVA":
        return "blue";
      case "COMPLETADA":
        return "green";
      default:
        return "default";
    }
  };

  const activityColumns = [
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (type: string) => getActivityIcon(type),
      width: 60,
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Cliente",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={true}
        userName={user?.name}
        onLogout={() => {}}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user?.name}. Gestiona todos los aspectos del sistema
          </p>
        </div>

        {/* Estadísticas Principales */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Solicitudes Totales"
                value={stats.totalRequests}
                prefix={<FileTextOutlined className="text-blue-500" />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Cotizaciones Pendientes"
                value={stats.pendingQuotes}
                prefix={<ClockCircleOutlined className="text-orange-500" />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Reservas Activas"
                value={stats.activeReservations}
                prefix={<CalendarOutlined className="text-purple-500" />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ingresos Totales"
                value={stats.totalRevenue}
                prefix={<DollarOutlined className="text-green-500" />}
                suffix="$"
                precision={2}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Estadísticas Secundarias */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Cotizaciones Aprobadas"
                value={stats.approbedQuotes}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Reservas Completadas"
                value={stats.completedReservations}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Clientes Registrados"
                value={stats.totalClients}
                prefix={<UserOutlined className="text-blue-500" />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Acciones Rápidas */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24}>
            <Card title="Acciones Rápidas">
              <Space wrap>
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={() => navigate("/dashboard/admin/quotes")}
                >
                  Gestionar Cotizaciones
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  onClick={() => navigate("/dashboard/admin/reservations")}
                >
                  Ver Reservas
                </Button>
                <Button
                  icon={<TeamOutlined />}
                  onClick={() => navigate("/dashboard/users")}
                >
                  Gestionar Usuarios
                </Button>
                <Button icon={<BarChartOutlined />}>Ver Reportes</Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Actividad Reciente */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card
              title="Actividad Reciente"
              extra={<Button type="link">Ver Todo</Button>}
            >
              <Table
                columns={activityColumns}
                dataSource={recentActivity}
                rowKey="id"
                loading={loading}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
