import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, AnimatedContainer, Background } from './styles';
import { Input, Button } from '../../components';
import logo from '../../assets/images/logo.svg';
import getValidationErrors from '../../utils/getvalidationErrors';
import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/toastContext';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const handleSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um email válido'),
        });
        await schema.validate(data, { abortEarly: false });
        await api.post('/password/forgot', {
          email: data.email,
        });
        addToast({
          type: 'success',
          title: 'E-mail de recuperação de senha',
          description:
            'Enviamos um email para confirmar a recuperação de senha',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro na recuperação de senha, verifique as credenciais informadas',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logo} alt="goBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperação de senha</h1>
            <Input
              icon={FiMail}
              name="email"
              type="text"
              placeholder="E-mail"
            />
            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar para a tela de login
          </Link>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
