import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth/auth.service";

@Injectable() //회원정보 확인 middleware
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService){
        super({ usernameField: 'name' });
    }
    
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        console.log(`local: ${user}`);
        if(!user){
            console.log('Throw UnAuthorizaed Exception');
            throw new UnauthorizedException();
        }
        console.log(true);
        return user;
    }
}