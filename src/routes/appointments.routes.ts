// Rotas recebem a requisição, chama outro arquivo e dão uma resposta
import { Router } from "express";
import { parseISO } from "date-fns";

import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";
import { getCustomRepository } from "typeorm";

const appointmentsRouter = Router();

appointmentsRouter.get("/", async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();
  response.json(appointments);
});

appointmentsRouter.post("/", async (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const CreateAppointment = new CreateAppointmentService();

    const appointment = await CreateAppointment.execute({
      provider,
      date: parsedDate,
    });

    response.json(appointment);
  } catch (err) {
    response.status(400).json({ error: (err as Error).message });
  }
});

export default appointmentsRouter;
