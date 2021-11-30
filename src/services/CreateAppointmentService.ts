// Regras de negócio da rota
// DTO - Data Transfer Object
// Retorna erros e nunca respostas diretamente
import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointment = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointment) {
      throw Error("This appointment already brooked.");
    }

    const appointment = appointmentsRepository.create({
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
