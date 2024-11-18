import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;

    if (!authToken) {
      throw new UnauthorizedException('Authorization header not found');
    }

    if (authToken !== process.env.API_TOKEN) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
