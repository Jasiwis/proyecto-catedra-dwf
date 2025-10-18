import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button } from "antd";
import {
  PlusOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { requestsApi } from "../../api/requests";
import { getMyQuotes } from "../../api/quote";
import { reservationsApi } from "../../api/reservations";
import { useAuth } from "../../hooks/use-auth";

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  const [quotesCount, setQuotesCount] = useState(0);
  const [confirmedEvents, setConfirmedEvents] = useState(0);
  const [completedEvents, setCompletedEvents] = useState(0);
  const [scheduledReservations, setScheduledReservations] = useState(0);
  const [inProgressReservations, setInProgressReservations] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [reqRes, quotesRes, resvRes] = await Promise.all([
          requestsApi.getMyRequests(),
          getMyQuotes(),
          reservationsApi.getMyReservations(),
        ]);
        const reqs = reqRes?.data || [];
        setPendingRequests(
          reqs.filter((r) => String(r.status) === "Activo").length
        );

        const quotes = quotesRes?.data || [];
        setQuotesCount(quotes.length);

        setConfirmedEvents(
          quotes.filter((q) => String(q.status) === "Aprobada").length
        );

        const res = resvRes?.data || [];

        // Contar eventos completados de reservaciones
        setCompletedEvents(
          res.filter((r: any) => String(r.status) === "FINALIZADA").length
        );

        setScheduledReservations(
          res.filter(
            (r: any) =>
              String(r.status) === "PROGRAMADA" ||
              String(r.status) === "EN_PLANEACION"
          ).length
        );
        setInProgressReservations(
          res.filter((r: any) => String(r.status) === "ENCURSO").length
        );
      } catch (e) {
        // silencioso en dashboard
      }
    };
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mi Panel de Cliente
        </h1>
        <p className="text-gray-600">
          Gestiona tus solicitudes y cotizaciones de eventos
        </p>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Solicitudes Activas"
              value={pendingRequests}
              prefix={<PlusOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cotizaciones Recibidas"
              value={quotesCount}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Eventos Confirmados"
              value={confirmedEvents}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Eventos Completados"
              value={completedEvents}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Nueva Solicitud" className="h-full">
            <p className="text-gray-600 mb-4">
              Crea una nueva solicitud de evento con todos los detalles
              necesarios.
            </p>
            <Link to="/client/requests">
              <Button type="primary" block size="large">
                <PlusOutlined /> Crear Nueva Solicitud
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Mis Cotizaciones" className="h-full">
            <p className="text-gray-600 mb-4">
              Revisa el estado de tus cotizaciones y aprueba las que desees.
            </p>
            <Link to="/client/quotes">
              <Button type="default" block size="large">
                <FileTextOutlined /> Ver Cotizaciones
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Mis Reservas" className="h-full">
            <p className="text-gray-600 mb-4">
              Consulta y monitorea el avance de tus reservas.
            </p>
            <Link to="/client/reservations">
              <Button type="dashed" block size="large">
                <CalendarOutlined /> Ver Reservas
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Actividad Reciente">
            <div className="text-gray-500">Próximamente</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientDashboard;
