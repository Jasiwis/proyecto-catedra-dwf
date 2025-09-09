import { useNavigate, useRouteError } from "react-router-dom";

type Props = {
  error: unknown;
};

const ErrorMessage: React.FC<Props> = ({ error }) => {
  return (
    <p className="text-lg text-custom_white">
      {(error as Error)?.message ||
        (error as { statusText?: string })?.statusText}
    </p>
  );
};

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-overlay_1">
      <div className="p-8 text-center rounded-lg shadow-md bg-overlay_1 shadow-primary">
        <h1 className="mb-2 text-6xl font-bold text-custom_white">404</h1>
        <p className="text-xl text-custom_white">
          ¡Oops! La página que buscas no se encuentra.
        </p>

        <ErrorMessage error={error} />
        <button
          className="px-4 py-2 mt-4 text-white transition duration-300 rounded-full bg-primary hover:bg-custom_white hover:text-overlay_1"
          onClick={() => navigate("/")}
        >
          Volver Atrás
        </button>
      </div>
    </div>
  );
};
export default Error;
