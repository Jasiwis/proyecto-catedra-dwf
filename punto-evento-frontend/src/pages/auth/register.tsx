import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorFromResponse } from "../../utils/get-errror-from-response.util";
import { AxiosError } from "axios";
import {
  AuthHeader,
  AuthCard,
  AuthForm,
  FormInput,
  FormButton,
} from "../../components/Forms/AuthForm";
import { register } from "../../api/auth";
import { useAuth } from "../../hooks/use-auth";
import Header from "../../components/Header/Header";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await register({ name, email, password });
      navigate("/login", { replace: true });
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
            <AuthForm title="Registro" error={error} onSubmit={handleSubmit}>
              <FormInput
                id="nombre"
                label="Nombre"
                type="text"
                name="name"
                value={name}
                onChange={setName}
                placeholder="Ingrese su nombre"
              />
              <FormInput
                id="email"
                label="Correo Electrónico"
                type="email"
                name="email"
                value={email}
                onChange={setEmail}
                placeholder="Ingrese su correo electrónico"
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
              <FormInput
                id="confirmar-contrasena"
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirme su contraseña"
              />
              <FormButton text="Registrarse" />
            </AuthForm>
            <div className="text-center mt-4">
              <a
                href="/login"
                className="text-gray-500 text-sm hover:underline"
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </a>
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
