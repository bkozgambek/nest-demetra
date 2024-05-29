import { Process, Processor } from "@nestjs/bull";
import { UserEntity } from './user.entity';
import { Job } from "bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Processor('user-queue')
export class UserConsumer {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    @Process('activateUser')
    async activateUser(job: Job<{ id: number }>) {
        await this.userRepository.update({ id: job.data.id }, { status: true })
    }
}