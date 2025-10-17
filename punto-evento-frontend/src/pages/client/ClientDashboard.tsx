import React from "react";
import { Card, Row, Col, Statistic, Button } from "antd";
import {
  PlusOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const ClientDashboard: React.FC = () => {
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
              title="Solicitudes Pendientes"
              value={2}
              prefix={<PlusOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cotizaciones Recibidas"
              value={5}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Eventos Confirmados"
              value={3}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Eventos Completados"
              value={8}
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
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Actividad Reciente">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-semibold">
                    Solicitud de Boda - María y Juan
                  </h4>
                  <p className="text-sm text-gray-600">
                    Estado: Cotización pendiente
                  </p>
                </div>
                <span className="text-blue-600 font-semibold">15/01/2024</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-semibold">
                    Evento Corporativo - Empresa ABC
                  </h4>
                  <p className="text-sm text-gray-600">Estado: Aprobado</p>
                </div>
                <span className="text-green-600 font-semibold">12/01/2024</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientDashboard;
