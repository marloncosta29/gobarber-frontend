import React from 'react';
import { useTransition } from 'react-spring';
import { ToastMessage } from '../../context/toastContext';
import { Container } from './styles';
import Toast from './Toast';

interface ToasterContainer {
  messages: ToastMessage[];
}
const ToasterContainer: React.FC<ToasterContainer> = ({ messages }) => {
  const messagesWithTransictions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%' },
      enter: { right: '0%' },
      leave: { right: '-120%' },
    },
  );

  return (
    <Container>
      {messagesWithTransictions.map(({ item, key, props }) => {
        return <Toast key={key} toast={item} style={props} />;
      })}
    </Container>
  );
};

export default ToasterContainer;
