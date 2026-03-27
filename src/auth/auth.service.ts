import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { email: dto.email },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      employee.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      sub: employee.id,
      email: employee.email,
      role: 'employee',
      name: employee.name,
    };
    return {
      access_token: this.generateToken(payload),
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
      },
    };
  }
  generateToken(payload: { sub: string; email: string; role: string }) {
    return this.jwtService.sign(payload);
  }
}
