import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

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
    const payload = { sub: employee.id, email: employee.email };
    return {
      access_token: this.jwtService.sign(payload),
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
      },
    };
  }
}
