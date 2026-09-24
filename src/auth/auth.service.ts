import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from '../db/database.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Role } from '../common/enums/role.enum.js';

@Injectable()
export class AuthService {
    constructor(private readonly db: DatabaseService) {}

    async register(dto: RegisterDto) {
        const existing = await this.db.get(
            `SELECT id FROM users WHERE email = ?`,
            [dto.email],
        );
        if (existing) {
            throw new ConflictException('Email already registered!');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const result = await this.db.run(
            `INSERT INTO users(name, email, password_hash, role)
                VALUES (?, ?, ?, ?)`,
            [dto.name, dto.email, passwordHash, dto.role || Role.USER]
            //                 ^^^^^^^^^^^ Fix: use passwordHash
        );

        return {
            success: true,
            message: 'User registered successfully',
            data: {
                id: result.lastID,
                name: dto.name,
                email: dto.email,
                role: dto.role || Role.USER,
            },
        };
    }

    async login(dto: LoginDto) {
        const user = await this.db.get(
            `SELECT id, name, email, password_hash, role
                FROM users WHERE email = ?`,
            [dto.email]
        );
        if (!user) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        const isPassValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPassValid) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            //         ^^^^^ Fix: typo
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        return {
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
        };
    }

    async getProfile(userId: number) {
        const user = await this.db.get(
            `SELECT id, name, role, created_at FROM users WHERE id = ?`,
            [userId],
        );
        if (!user) {
            throw new UnauthorizedException('User not found!');
        }
        return {
            success: true,
            data: user,
        };
    }
}