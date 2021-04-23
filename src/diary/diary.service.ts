import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from 'typeorm';
import { Post } from '../entity/Diary';

@Injectable()
export class DiaryService {
    constructor(
        private readonly jwtService: JwtService
    ) { }
    private logger = new Logger();
    async getDiary(request, response): Promise<object> {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data) {
                throw new UnauthorizedException();
            }
            const diary = await getConnection()
                .createQueryBuilder()
                .select('post')
                .from(Post, 'post')
                .where('post.userUid = :userUid', { userUid: data.id })
                .getMany();
            if (diary.length === 0) {
                throw new NotFoundException();
            }
            this.logger.log(`Success to get list User: ${data.name}`);
            return response.status(200).json({
                status: 200,
                totalCount: diary.length,
                data: diary
            });
        } catch (e) {
            throw new NotFoundException();
        }
    }

    async writeDiary(request, response): Promise<string> {
        const req = request.body;
        const cookie = request.cookies['jwt'];
        if (!cookie) {
            throw new UnauthorizedException();
        }
        const data = await this.jwtService.verifyAsync(cookie);
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Post)
            .values({ userUid: data.id, title: req.title, content: req.content })
            .execute()
            .catch(Error => {
                console.log(Error);
                this.logger.log(`Fail to write Diary`);
                throw new BadRequestException(`Fail to write Diary`);
            });
        this.logger.log(`Success to write Diary Title: ${req.title}`);
        return response.status(201).json({
            status: 201,
            message: 'Success to write Diary'
        });
    }
}
