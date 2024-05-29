import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from './users/user.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      database: "test",
      password: 'password',
      synchronize: true,
      logging: true,
      subscribers: [],
      migrations: [],
      entities: [UserEntity]
    })

  ]
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
