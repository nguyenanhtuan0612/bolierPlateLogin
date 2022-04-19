import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookAuth extends AuthGuard('facebook') {}
