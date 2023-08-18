import { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler, useFormState } from "react-hook-form";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from "react";

interface IRegistrationForm {
  username: string;
  email: string;
  password: string;
}

interface RegistrationFormProps {
  onRegistration: (prop: boolean, id?: string) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistration }) => {
  const { handleSubmit, control } = useForm<IRegistrationForm>();
  const { errors } = useFormState({ control });
  const navigate = useNavigate();


  const onSubmit: SubmitHandler<IRegistrationForm> = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const parsedResponse = await response.json();

      if (response.status === 201) {
        onRegistration(true, parsedResponse.payload.userId);
        navigate("/dashboard");
      } else {
        const errorData = await response.json(); 
        alert(errorData.message)
        onRegistration(false);
      }
    } catch (error) {
      console.error('Ошибка при выполнении POST-запроса:', error);
    }
  };


  return (
    <div className="auth-form">
      <Typography variant="h3" component="div">
        Зарегистрируйтесь
      </Typography>
      <form className="auth-form__form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="username"
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
              error={!!errors.username?.message}
              helperText={errors.username?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{ required: "Обязательно заполнить" }}
          render={({ field }) => (
            <TextField
              label="Email"
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
          Зарегистрироваться
        </Button>
        <div>
          Уже есть аккаунт? <Link to="/">Войдите</Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm; 