import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from "dotenv";
dotenv.config();

@Injectable() //jwt 유효확인 middleware
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            //jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Cookie"),
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
                return req.cookies.jwt;
            }]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any){
        return { userId: payload.sub, username: payload.username };
    }
}