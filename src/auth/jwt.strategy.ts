import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("cookie"),
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        console.log('jwtstrategy - constructor is run');
    }

    async validate(payload: any){
        console.log('jwt.strategy validate is run');
        return { userId: payload.sub, username: payload.username };
    }
}