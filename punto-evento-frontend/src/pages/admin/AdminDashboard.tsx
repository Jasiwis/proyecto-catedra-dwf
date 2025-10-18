import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Button, message } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getAllQuotations } from "../../api/quote";
import { reservationsApi } from "../../api/reservations";
import { usersApi } from "../../api/users";

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    quotes: 0,
    reservations: 0,
    users: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [quotesRes, reservationsRes, usersRes] = await Promise.all([
        getAllQuotations().catch(() => ({ data: [] })),
        reservationsApi.getAllReservations().catch(() => ({ data: [] })),
        usersApi.getAllUsers().catch(() => ({ data: [] })),
      ]);

      setStats({
        quotes: quotesRes.data?.length || 0,
        reservations: reservationsRes.data?.length || 0,
        users: usersRes.data?.length || 0,
      });
    } catch (error) {
      message.error("Error al cargar estadísticas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Bienvenido al panel de administración de Punto Evento
        </p>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Cotizaciones"
              value={stats.quotes}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Reservas"
              value={stats.reservations}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Usuarios Registrados"
              value={stats.users}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Eventos"
              value={stats.quotes + stats.reservations}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Gestión de Cotizaciones" className="h-full">
            <p className="text-gray-600 mb-4">
              Revisa y gestiona todas las cotizaciones del sistema.
            </p>
            <Link to="/admin/quotes">
              <Button type="primary" block>
                Ir a Cotizaciones
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Gestión de Reservas" className="h-full">
            <p className="text-gray-600 mb-4">
              Administra las reservas y eventos confirmados.
            </p>
            <Link to="/admin/reservations">
              <Button type="primary" block>
                Ir a Reservas
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Gestión de Usuarios" className="h-full">
            <p className="text-gray-600 mb-4">
              Administra usuarios del sistema (admin y empleados).
            </p>
            <Link to="/admin/users">
              <Button type="primary" block>
                Ir a Usuarios
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
