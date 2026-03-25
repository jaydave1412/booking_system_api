import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';
import { Employee } from 'generated/prisma/client';

type SafeEmployee = Omit<Employee, 'password'>;

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto): Promise<SafeEmployee> {
    const existing = await this.prisma.employee.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Employee with this email already exists');
    }
    const hashPassword = await bcrypt.hash(dto.password, 10);
    const employee = await this.prisma.employee.create({
      data: { name: dto.name, email: dto.email, password: hashPassword },
    });
    const { password: _password, ...result } = employee;
    return result as SafeEmployee;
  }

  async findAll(): Promise<SafeEmployee[]> {
    const employees = await this.prisma.employee.findMany();
    return employees.map(
      ({ password: _password, ...rest }) => rest as SafeEmployee,
    );
  }

  async findById(id: string): Promise<SafeEmployee> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    const { password: _password, ...result } = employee;
    return result as SafeEmployee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<SafeEmployee> {
    await this.findById(id);
    if (dto.email) {
      const conflict = await this.prisma.employee.findUnique({
        where: { email: dto.email },
      });
      if (conflict && conflict.id !== id) {
        throw new ConflictException('Employee with this email already exists');
      }
    }
    const data: Partial<Employee> = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    const employee = await this.prisma.employee.update({ where: { id }, data });
    const { password: _password, ...result } = employee;
    return result as SafeEmployee;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.employee.delete({ where: { id } });
  }
}
