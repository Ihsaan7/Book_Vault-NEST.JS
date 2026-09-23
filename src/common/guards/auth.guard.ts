import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization']
    
        if(!authHeader || !authHeader.startWith('Bearer '))
            {
                throw new UnauthorizedException("Missing or Invalid authorization header")
            }
            
        const token = authHeader.split(' ')[1];
        if(!token){ throw new UnauthorizedException('Token not provided')}

        request.user = {id:1 , role: 'USER'}
        return true
    }
}