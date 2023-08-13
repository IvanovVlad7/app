import React, { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, SubmitHandler, useFormState } from "react-hook-form";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import './Login.css'

interface ILoginForm {
  login: string;
  email: string; 
  password: string;
}

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { handleSubmit, control } = useForm<ILoginForm>();
  const { errors } = useFormState({ control });

  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    onLogin(data.login);
  };

  return (
    <div className="auth-form">
      <Typography variant="h3" component="div">
        Войдите
      </Typography>
      <form className="auth-form__form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="login"
          rules={{ required: "Обязательно заполнить" }}
          render={({ field }) => (
            <TextField
              label="Имя пользователя"
              size="small"
              margin="normal"
              className="auth-form__input"
              fullWidth={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e)}
              value={field.value}
              error={!!errors.login?.message}
              helperText={errors.login?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email" 
          rules={{ required: "Обязательно заполнить" }}
          render={({ field }) => (
            <TextField
              label="email" 
              size="small"
              margin="normal"
              className="auth-form__input"
              fullWidth={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e)}
              value={field.value}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: "Обязательно заполнить" }}
          render={({ field }) => (
            <TextField
              label="Пароль"
              type="password"
              size="small"
              margin="normal"
              className="auth-form__input"
              fullWidth={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e)}
              value={field.value}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth={true}
          disableElevation={true}
          sx={{
            marginTop: 2,
          }}
        >
          Войти
        </Button>
        <div>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;