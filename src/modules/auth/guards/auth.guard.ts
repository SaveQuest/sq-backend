import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const allow = this.reflector.getAllAndOverride<boolean>("allowUnauthorizedRequest", [context.getClass(), context.getHandler()]) ?? false
    if (allow) {
      return true
    }

    const request = context.switchToHttp().getRequest<IncomingMessage>()
    const token = request.headers.authorization?.substring(7) ?? ""

    try {
      const { userId } = this.jwtService.verify(token)
      if (!userId) return false

      request.userId = userId
      return true
    } catch (_) {
      return false
    }
  }
}
