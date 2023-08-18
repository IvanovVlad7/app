import { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, SubmitHandler, useFormState } from "react-hook-form";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import './Login.css'
import * as React from "react";

interface ILoginForm {
  name: string;
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (prop: boolean, id: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }: any) => {
  const { handleSubmit, control } = useForm<ILoginForm>();
  const { errors } = useFormState({ control });

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const parsedResponse = await response.json();
      
      if (response.status === 200) {
        console.log('success');
        
        onLogin(true, parsedResponse.payload.userId)
      } else {
        console.log('fail');
        
        const errorData = await response.json(); 
        alert(errorData.message)
        onLogin(false)
      }
    } catch (error) {
      console.error('Ошибка при выполнении POST-запроса:', error);
    }
  };

  return (
    <div className="auth-form">
      <Typography variant="h3" component="div">
        Войдите
      </Typography>
      <form className="auth-form__form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
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
              error={!!errors.name?.message}
              helperText={errors.name?.message}
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