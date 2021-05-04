import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth/auth.service";

@Injectable() //회원정보 중복확인 middleware
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService){
        super({ usernameField: 'name' });
    }
    
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if(!user){
            throw new BadRequestException();
        }
        return user;
    }
}