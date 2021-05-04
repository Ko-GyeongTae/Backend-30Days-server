import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConnection, getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { User } from '../entity/User';
import { Diary } from '../entity/Diary';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) { }
    private logger = new Logger();

    findUserAll(): Promise<User[]> {
        return getRepository(User).find();
    }

    findDiaryAll(): Promise<Diary[]> {
        return getRepository(Diary).find();
    }

    async getProfile(request, response): Promise<object> {
        const cookie = request.cookies['jwt'];
        if (!cookie) {
            this.logger.log("[Log] Cannot find cookie");
            throw new UnauthorizedException();
        }
        const data = await this.jwtService.verifyAsync(cookie);
        this.logger.log(`[Log] ${data.name} is search myprofile`);
        return response.status(200).json({
            status: 200,
            myProfile: data
        });
    }

    async signUp(request, response): Promise<string> {
        const req = request.body;
        const check = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.name = :name", { name: req.name })
            .getOne();
        if (check) {
            this.logger.log("[Log] Same name is already exist!");
            throw new BadRequestException();
        }
        if (!check) {
            if (!req.password) {
                this.logger.log("[Log] Password is not exits!");
                throw new BadRequestException();
            }
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({ name: req.name, password: await hash(req.password, 10) })
                .execute()
                .catch(Error => {
                    this.logger.log(`[Log] Fail to signup User: ${req.name}`);
                    return new BadRequestException('Fail to signup');
                });
            this.logger.log(`[Log] Success to signup User: ${req.name}`);
            return response.status(200).json({
                status: 200,
                message: "Success to signup"
            })
        }
    }


    async signIn(request, response): Promise<Object> {
        const req = request.body;
        if (!req.name || !req.password) {
            this.logger.log(`[Log] Undefined Name or Password`);
            throw new BadRequestException();
        }
        const user = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.name = :name", { name: req.name })
            .getOne();
        await this.verifyPassword(req.password, user.password);
        this.logger.log(`[Log] ${request.method} : ${request.url} : ${req.name}`);
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

    private async verifyPassword(
        plainPassword: string,
        hashedPassword: string,
    ) {
        const isPasswordMatch = await compare(plainPassword, hashedPassword);
        if (!isPasswordMatch) {
            console.log(isPasswordMatch);
            throw new BadRequestException();
        }
    }

    async dropOut(request, response): Promise<Object> {
        const req = request.body;
        const cookie = request.cookies['jwt'];
        if (!cookie) {
            this.logger.log(`[Log] Undefined cookie`);
            throw new UnauthorizedException();
        }
        const data = await this.jwtService.verifyAsync(cookie);
        const user = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.uid = :uid", { uid: data.id })
            .getOne();
        if (user.password !== req.password) {
            throw new BadRequestException();
        } else {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Diary, 'Diary')
                .where("Diary.userUid = :userUid", { userUid: data.uid })
                .execute()
                .catch(Error => {
                    console.log(Error);
                    this.logger.log(`[Log] Fail to delete Diarys`);
                    throw new BadRequestException(`Fail to delete Diarys User: ${data.name}`);
                });
            this.logger.log(`[Log] Success to delete Diarys User: ${data.name}`);
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(User, 'user')
                .where("user.uid = :uid", { uid: data.id })
                .execute()
                .catch(Error => {
                    console.log(Error);
                    this.logger.log(`[Log] Fail to drop out User: ${data.name}`);
                    throw new BadRequestException(`Fail to drop out User: ${data.name}`);
                });
            response.clearCookie('jwt');
            return response.status(200).json({
                status: 200,
                message: 'Success to drop out'
            });
        }
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.name = :name", { name: username })
            .getOne();
        if (user && user.password === password) {
            const { password, ...result } = user;
            console.log(result);
            return result;
        }
        return null;
    }

    async logOut(request, response): Promise<Object> {
        const cookie = request.cookies['jwt'];
        if (!cookie) {
            this.logger.log(`[Log] Fail to logout`);
            throw new UnauthorizedException();
        }
        const data = await this.jwtService.verifyAsync(cookie);
        response.clearCookie('jwt');
        this.logger.log(`[Log] Success to logout User: ${data.name}`);
        return response.status(200).json({
            status: 200,
            message: 'Success to logout'
        });
    }
}

