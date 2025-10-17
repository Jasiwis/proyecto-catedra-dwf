import React from "react";
import { Card, Row, Col, Statistic, Button, Progress } from "antd";
import {
  CheckSquareOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mi Panel de Trabajo
        </h1>
        <p className="text-gray-600">
          Gestiona tus tareas asignadas y mantén un seguimiento de tu progreso
        </p>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tareas Pendientes"
              value={5}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="En Progreso"
              value={2}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completadas Hoy"
              value={3}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Completadas"
              value={47}
              prefix={<CheckSquareOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Mis Tareas" className="h-full">
            <p className="text-gray-600 mb-4">
              Ve y gestiona todas las tareas asignadas a ti.
            </p>
            <Link to="/employee/tasks">
              <Button type="primary" block size="large">
                <CheckSquareOutlined /> Ver Mis Tareas
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Progreso Semanal">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Tareas Completadas</span>
                  <span>75%</span>
                </div>
                <Progress percent={75} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Horas Trabajadas</span>
                  <span>32/40 hrs</span>
                </div>
                <Progress percent={80} strokeColor="#1890ff" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Tareas Urgentes">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
                <div>
                  <h4 className="font-semibold text-red-800">
                    Instalación de Sonido
                  </h4>
                  <p className="text-sm text-red-600">
                    Evento: Boda María y Juan
                  </p>
                </div>
                <span className="text-red-600 font-semibold">Hoy 2:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded">
                <div>
                  <h4 className="font-semibold text-orange-800">
                    Entrega de Mobiliario
                  </h4>
                  <p className="text-sm text-orange-600">
                    Evento: Corporativo ABC
                  </p>
                </div>
                <span className="text-orange-600 font-semibold">
                  Mañana 9:00 AM
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Logros Recientes">
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded">
                <CheckCircleOutlined className="text-green-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800">
                    Tarea Completada
                  </h4>
                  <p className="text-sm text-green-600">
                    Decoración de Salón - Evento XYZ
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded">
                <CheckCircleOutlined className="text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Meta Semanal Alcanzada
                  </h4>
                  <p className="text-sm text-blue-600">
                    8/8 tareas completadas esta semana
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDashboard;
