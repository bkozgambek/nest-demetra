import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { BullModule } from "@nestjs/bull";
import { UserConsumer } from "./users.consumer";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: 'user-queue',
        }),
        CacheModule.register({
            host: 'localhost',
            port: 6379,
        }),

    ],
    controllers: [UserController],
    providers: [UserService, UserConsumer]
})
export class UserModule { }