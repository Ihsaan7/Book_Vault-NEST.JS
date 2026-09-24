import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../db/database.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Role } from '../common/enums/role.enum.js';

@Injectable()
export class AuthService{
    constructor(private readonly db: DatabaseService){}

    //------------------ Register a user
    async register(dto: RegisterDto){
        // Check for existing mail
        const existing = await this.db.get(
            `SELECT id FROM users WHERE email = ?`,
            [dto.email],
        );
        if(existing){ throw new ConflictException('Email already registered!')}

        // Hash pass
        const passwordHash = await bcrypt.hash(dto.password , 10)

        // Insert user into DB
        const result = await this.db.run(
            `INSERT INTO users(name , email , password_hash , role)
                VALUES (? , ? , ? , ?)
            `,
            [dto.name , dto.email ,  dto.password , dto.role || Role.USER]
        )

        return{
            success: true,
            message:"User registered succesfully",
            data:{
                id: result.lastID,
                name: dto.name,
                email: dto.email,
                role: dto.role || Role.USER
            }
        }
    }


    //----------------- LOGIN USER
    async login(dto: LoginDto){
        // Find user by email
        const user = await this.db.get(
            `SELECT id , name , email , password_hash , role
                FROM users WHERE email = ?`,
            [dto.email]
        );
        if(!user){ throw new UnauthorizedException("Invalid credentials!")}

        // Compare pass
        const isPassValid = await bcrypt.compare(dto.password , user.password_hash)
        if(!isPassValid){ throw new UnauthorizedException("Invalid credentials!")}

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id , emial: user.email, role:user.role},
            process.env.JWT_SECRET_KEY || 'fallback_secret_key_for_development',
            {expiresIn: process.env.JWT_SECRET_EXPIRES || '1h'}
        );

        return{
            success: true,
            message: "Login successfull",
            data:{
                token,
                user:{
                    id:user.id,
                    email: user.email,
                    role: user.role
                }
            }
        }
    }


    //------------------ GET CURRENT USER
    async getProfile(userId: number){
        const user = await this.db.get(
            `SELECT id , name , role , created_at FROM users WHERE id =  ?`,
            [userId],
        )
        if(!user){ throw new UnauthorizedException("User not found!")}
        return{
            success: true,
            data: user
        }
    }







}