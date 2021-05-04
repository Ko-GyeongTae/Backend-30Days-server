import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            //jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Cookie"),
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
                console.log(req.cookies.jwt);
                return req.cookies.jwt;
            }]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        console.log('jwtstrategy - constructor is run');
    }

    async validate(payload: any){
        return { userId: payload.sub, username: payload.username };
    }
}