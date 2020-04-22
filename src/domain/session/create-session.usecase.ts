import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import signingConfig from '../../config/signing.constants';
import User from '../../data/database/entity/user.entity';
import { CreateSessionResponseDTO } from '../models/session/create-session-response.dto';

interface CreateSessionRequestDTO {
  email: string;
  password: string;
}

export default class CreateSessionUseCase {
  async execute({
    email,
    password,
  }: CreateSessionRequestDTO): Promise<CreateSessionResponseDTO> {
    const userRepository = getRepository(User);
    const userFound = await userRepository.findOne({ where: { email } });
    if (!userFound) {
      throw new Error('Email or password does not match');
    }
    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      throw new Error('Email or password does not match');
    }
    const { secretKey, expiresIn } = signingConfig;
    const token = jwt.sign({ userId: userFound.id }, secretKey, {
      subject: userFound.id,
      expiresIn,
    });
    return {
      token,
      user: { id: userFound.id, email: userFound.email, name: userFound.name },
    };
  }
}