import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { getErrorFromResponse } from "../../utils/get-errror-from-response.util";
import { AxiosError } from "axios";
import {
  AuthHeader,
  AuthCard,
  AuthForm,
  FormInput,
  FormButton,
} from "../../components/Forms/AuthForm";
import Header from "../../components/Header/Header";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(getErrorFromResponse(e.response?.data));
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eaf1fb]">
      <Header
        isAuthenticated={isAuthenticated}
        userName={undefined}
        onLogout={() => {}}
      />
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-[#7da2c1] to-[#eaf1fb]">
        <div className="w-full max-w-md">
          <AuthHeader
            title="Punto Evento"
            subtitle="Sistema de Gestión de Eventos"
          />
          <AuthCard>
            <AuthForm
              title="Iniciar Sesión"
              error={error}
              onSubmit={handleSubmit}
            >
              <FormInput
                id="usuario"
                label="Usuario"
                type="text"
                name="username"
                value={username}
                onChange={setUsername}
                placeholder="Ingrese su nombre de usuario"
              />
              <FormInput
                id="contrasena"
                label="Contraseña"
                type="password"
                name="password"
                value={password}
                onChange={setPassword}
                placeholder="Ingrese su contraseña"
              />
              <FormButton text="Ingresar" />
            </AuthForm>
            <div className="text-center mt-4">
              <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
