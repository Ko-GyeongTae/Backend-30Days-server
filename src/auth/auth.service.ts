import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Post } from 'src/entity/Diary';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) {}
    private logger = new Logger();
    async signUp(request, response): Promise<string> {
        const req = request.body;
        const check = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.name = :name", { name: req.name })
            .getOne();
        if(check){
            this.logger.log("Same name is already exist!");
            throw new BadRequestException();
        }
        if (!check) {
            if(!req.password){
                this.logger.log("Password is not exits!");
                throw new BadRequestException();
            }
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({ name: req.name, password: req.password })
                .execute()
                .catch(Error => {
                    this.logger.log(`Fail to signup User: ${req.name}`);
                    return new BadRequestException('Fail to signup');
                });
            this.logger.log(`Success to signup User: ${req.name}`);
            return response.status(200).json({
                status: 200,
                message: "Success to signup"
            })
        }
    }

    async signIn(request, response): Promise<Object> {
        const req = request.body;

        const user = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.password = :password && user.name = :name", { password: req.password, name: req.name })
            .getOne();
        this.logger.log(`${request.method} : ${request.url} : ${req.name}`);
        if (!user) {
            throw new BadRequestException('invalid credentials');
        }
        const jwt = await this.jwtService.signAsync({ id: user.uid, name: user.name });
        response.cookie('jwt', jwt, { httpOnly: true });
        return response.status(200).json({
            status: 200,
            message: 'Success to login',
            access_token: jwt,
        });

    }

    async dropOut(request, response): Promise<Object> {
        const req = request.body;
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        if (!data) {
            throw new UnauthorizedException();
        }
        const user = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.uid = :uid", { uid: data.id })
            .getOne();
        console.log(req, data, user);
        if(user.password !== req.password){
            throw new BadRequestException();
        } else {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Post, 'post')
                .where("post.userUid = :userUid", { userUid: data.uid })
                .execute()
                .catch(Error => {
                    console.log(Error);
                    this.logger.log(`Fail to delete posts`);
                    throw new BadRequestException(`Fail to delete posts User: ${data.name}`);
                });
            this.logger.log(`Success to drop out User: ${data.name}`);
            return response.status(200).json({
                status: 200,
                message: 'Success to drop out'
            });
        }
    }
}

