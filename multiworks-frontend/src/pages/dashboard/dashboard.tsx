import { Card, Row, Col, Statistic, Typography, Button, Spin } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/use-auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuotations } from "../../api/quote";
import { getAllClients } from "../../api/clients";
import { getAllEmployees } from "../../api/employee";
import { getAssignmentsByQuote } from "../../api/ssignments";
import { getTasksByAssignment } from "../../api/task";
import { QuoteStatus } from "../../enums/quote-status.enum";
import { Status } from "../../enums/status.enum";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    inProgressQuotes: 0,
    completedQuotes: 0,
    cancelledQuotes: 0,
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalAssignments: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [quotesRes, clientsRes, employeesRes] = await Promise.all([
          getAllQuotations(),
          getAllClients(),
          getAllEmployees(),
        ]);

        const quotes = quotesRes.data;
        const clients = clientsRes.data;
        const employees = employeesRes.data;

        // Calculate quote stats
        const inProgressQuotes = quotes.filter(
          (q) => q.status === QuoteStatus.EnProceso
        ).length;
        const completedQuotes = quotes.filter(
          (q) => q.status === QuoteStatus.Finalizada
        ).length;
        const cancelledQuotes = quotes.filter(
          (q) => q.status === QuoteStatus.Cancelada
        ).length;

        // Calculate client stats
        const activeClients = clients.filter(
          (c) => c.status === Status.Activo
        ).length;
        const inactiveClients = clients.filter(
          (c) => c.status === Status.Inactivo
        ).length;

        // Calculate employee stats
        const activeEmployees = employees.filter(
          (e) => e.status === Status.Activo
        ).length;
        const inactiveEmployees = employees.filter(
          (e) => e.status === Status.Inactivo
        ).length;

        // Fetch assignments and tasks for each quote
        let totalAssignments = 0;
        let totalTasks = 0;

        for (const quote of quotes) {
          const assignmentsRes = await getAssignmentsByQuote(quote.id);
          const assignments = assignmentsRes.data;
          totalAssignments += assignments.length;

          for (const assignment of assignments) {
            const tasksRes = await getTasksByAssignment(assignment.id);
            totalTasks += tasksRes.data.length;
          }
        }

        setStats({
          totalQuotes: quotes.length,
          inProgressQuotes,
          completedQuotes,
          cancelledQuotes,
          totalClients: clients.length,
          activeClients,
          inactiveClients,
          totalEmployees: employees.length,
          activeEmployees,
          inactiveEmployees,
          totalAssignments,
          totalTasks,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        onLogout={logout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Title level={2} className="mb-8">
          Dashboard
        </Title>

        {/* Quotes Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Cotizaciones"
                value={stats.totalQuotes}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="En Proceso"
                value={stats.inProgressQuotes}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Finalizadas"
                value={stats.completedQuotes}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Canceladas"
                value={stats.cancelledQuotes}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Clients and Employees Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12}>
            <Card title="Clientes">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Total"
                    value={stats.totalClients}
                    prefix={<UserOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Activos"
                    value={stats.activeClients}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Inactivos"
                    value={stats.inactiveClients}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card title="Empleados">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Total"
                    value={stats.totalEmployees}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Activos"
                    value={stats.activeEmployees}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Inactivos"
                    value={stats.inactiveEmployees}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Assignments and Tasks Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="Total Asignaciones"
                value={stats.totalAssignments}
                prefix={<ProjectOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="Total Tareas"
                value={stats.totalTasks}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="Acciones Rápidas" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button block onClick={() => navigate("/dashboard/quotes")}>
                  Ver Cotizaciones
                </Button>
                <Button block onClick={() => navigate("/dashboard/clients")}>
                  Ver Clientes
                </Button>
                <Button block onClick={() => navigate("/dashboard/employees")}>
                  Ver Empleados
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
