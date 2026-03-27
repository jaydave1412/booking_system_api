import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';

type SafeCustomer = Omit<Customer, 'password'>;

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async create(dto: CreateCustomerDto): Promise<SafeCustomer> {
    const existing = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Customer with this email already exists');
    }
    const hashPassword = await bcrypt.hash(dto.password, 10);
    const customer = await this.prisma.customer.create({
      data: { name: dto.name, email: dto.email, password: hashPassword },
    });
    const { password: _password, ...result } = customer;
    return result as SafeCustomer;
  }

  async login(dto: LoginDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      customer.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      sub: customer.id,
      email: customer.email,
      role: 'customer',
      name: customer.name,
    };
    return {
      access_token: this.auth.generateToken(payload),
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    };
  }

  async findAll(): Promise<SafeCustomer[]> {
    const customers = await this.prisma.customer.findMany();
    return customers.map(
      ({ password: _password, ...rest }) => rest as SafeCustomer,
    );
  }

  async findById(id: string): Promise<SafeCustomer> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    const { password: _password, ...result } = customer;
    return result as SafeCustomer;
  }
}
