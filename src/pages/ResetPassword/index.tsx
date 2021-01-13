import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Container, Content, AnimatedContainer, Background } from './styles';
import { Input, Button } from '../../components';
import logo from '../../assets/images/logo.svg';
import getValidationErrors from '../../utils/getvalidationErrors';
import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/toastContext';
import api from '../../services/api';

interface ResetPasswordData {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword = (): JSX.Element => {
  const formRef = useRef<FormHandles>(null);
  const location = useLocation();
  const { addToast } = useToast();
  const history = useHistory();
  const handleSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: ResetPasswordData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha é obrigatória'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'A senha não confere',
          ),
        });
        await schema.validate(data, { abortEarly: false });
        const token = location.search.replace('?token=', '');
        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          token,
          password: data.password,
          password_confirmation: data.passwordConfirmation,
        });
        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description:
            'Ocorreu um erro ao resetar a sua senha, tente novamente',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logo} alt="goBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Nova senha"
            />
            <Input
              icon={FiLock}
              name="passwordConfirmation"
              type="password"
              placeholder="Confirmar senha"
            />
            <Button type="submit">Alterar</Button>
          </Form>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
