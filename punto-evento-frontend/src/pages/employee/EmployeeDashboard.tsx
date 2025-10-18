import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Button, message } from "antd";
import {
  CheckSquareOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { tasksApi, Task } from "../../api/task";
import { getErrorFromResponse } from "../../utils/get-errror-from-response.util";

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getMyTasks();
      setTasks(response.data);
    } catch (error) {
      const errorMessage = getErrorFromResponse(error);
      message.error(`Error al cargar las tareas: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === "PENDIENTE").length;
  const inProgressTasks = tasks.filter((t) => t.status === "EN_PROCESO").length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETADA").length;

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
          <Card loading={loading}>
            <Statistic
              title="Tareas Pendientes"
              value={pendingTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="En Progreso"
              value={inProgressTasks}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Completadas"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total de Tareas"
              value={tasks.length}
              prefix={<CheckSquareOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24}>
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
      </Row>
    </div>
  );
};

export default EmployeeDashboard;
