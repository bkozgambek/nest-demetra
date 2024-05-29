import { Inject, Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectQueue('user-queue')
        private userQueue: Queue,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async create(user: User): Promise<UserEntity> {
        let data = await this.userRepository.findOne({
            where: {
                email: user.email
            }
        })
        if (data) {
            return null
        }

        // перед этим пароль нужно хэшировать через bcrypt
        data = this.userRepository.create({
            ...user
        })
        await this.userRepository.save(data)
        const job = await this.produceActivateUser(data.id)
        return data
    }

    async getOneUser(id: number): Promise<any> {
        const user = await this.cacheManager.get(id + '');
        if (user) {
            return user
        } else {

            const user = await this.userRepository.findOneBy({ id })
            if (user) {
                await this.cacheManager.set(id + '', user, 30 * 60 * 1000)
            }
            return user
        }
    }

    async produceActivateUser(id: number) {
        const job = await this.userQueue.add('activateUser',
            {
                id
            },
            {
                delay: 10000
            }
        );
        return job
    }
    // решил сюда впихнуть, по хорошему в отдельной папке utils должно быть
    async fetchFromProxy() {

        const proxy = {
            host: '45.196.48.9',
            port: 5435,
            auth: {
                username: 'jtzhwqur',
                password: 'jnf0t0n2tecg'
            }
        }

        const url = 'http://webhook.site/5997afef-aa84-4f23-b8f9-82a38270420b'

        const response = await axios.get(url, { proxy });
        return response.data
    }

}
