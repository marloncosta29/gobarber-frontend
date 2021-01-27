/* eslint-disable import/no-duplicates */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import date, { isToday, format, parseISO, isAfter } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptBR from 'date-fns/locale/pt-BR';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderConent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';
import logo from '../../assets/images/logo.svg';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';

interface Appointments {
  id: string;
  provider_id: string;
  user_id: string;
  date: string;
  hourFormatted: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar: string;
  avatar_url: string;
}

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}
// interface Appointments{}
const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const selecteddateASText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
  }, [selectedDate]);
  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR });
  }, [selectedDate]);
  const handleDateChange = useCallback(
    (day: Date, modifiers: DayModifiers): void => {
      if (modifiers.available && !modifiers.disabled) {
        setSelectedDate(day);
      }
    },
    [],
  );
  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);
  useEffect(() => {
    api
      .get(`providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);
  useEffect(() => {
    api
      .get<Appointments[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(ap => {
          return {
            ...ap,
            hourFormatted: format(parseISO(ap.date), 'HH:mm'),
          };
        });
        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);
  const disableDays = useMemo(() => {
    const dates = monthAvailability
      .filter(month => month.available === false)
      .map(month => {
        return new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          month.day,
        );
      });
    return dates;
  }, [currentMonth, monthAvailability]);
  const morningAppoitments = useMemo(() => {
    return appointments.filter(ap => {
      return parseISO(ap.date).getHours() < 12;
    });
  }, [appointments]);
  const afternoonAppoitments = useMemo(() => {
    return appointments.filter(ap => {
      return parseISO(ap.date).getHours() >= 12;
    });
  }, [appointments]);
  const nextAppointment = useMemo(() => {
    return appointments.find(ap => isAfter(parseISO(ap.date), new Date()));
  }, [appointments]);
  return (
    <Container>
      <Header>
        <HeaderConent>
          <img src={logo} alt="gobarber" />
          <Profile>
            {/* dsdsdsd */}
            <img src={user.avatar_url} alt="gobarber" />
            <div>
              <span>Bem vindo</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderConent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selecteddateASText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppoitments.map(ap => {
              return (
                <Appointment key={ap.id}>
                  <span>
                    <FiClock />
                    {ap.hourFormatted}
                  </span>
                  <div>
                    <img src={ap.user.avatar_url} alt={ap.user.name} />
                    <strong>{ap.user.name}</strong>
                  </div>
                </Appointment>
              );
            })}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppoitments.map(ap => {
              return (
                <Appointment key={ap.id}>
                  <span>
                    <FiClock />
                    {ap.hourFormatted}
                  </span>
                  <div>
                    <img src={ap.user.avatar_url} alt={ap.user.name} />
                    <strong>{ap.user.name}</strong>
                  </div>
                </Appointment>
              );
            })}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[
              {
                daysOfWeek: [0, 6],
              },
              ...disableDays,
            ]}
            selectedDays={selectedDate}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};
export default Dashboard;
