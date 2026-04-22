import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full">
        <LoginForm onSubmit={login} isLoading={isLoggingIn} />
        {loginError && (
          <p className="mt-4 text-center text-sm text-destructive font-medium">
            {(loginError as Error).message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
