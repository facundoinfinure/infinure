import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

interface LoginDto {
  email: string;
  password: string;
  code?: string;
}

interface SignupDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  industryType?: string;
}

interface RefreshTokenDto {
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password, body.code);
  }

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      organizationName: body.organizationName,
      industryType: body.industryType,
    });
  }

  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable-mfa')
  async enableMfa(@Req() req: any) {
    return this.authService.enableMfa(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-mfa')
  async verifyMfa(@Req() req: any, @Body() body: { token: string }) {
    return this.authService.verifyMfa(req.user.userId, body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Req() req: any) {
    return {
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      role: req.user.role,
      email: req.user.email
    };
  }
} 