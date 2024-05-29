import { Body, Controller, Get, Param, Post, Res, ValidationPipe } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FastifyReply } from 'fastify'

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto, @Res() response: FastifyReply) {
        const user = await this.userService.create(createUserDto)
        if (!user) {
            response.status(400).send({
                statusCode: 400,
                message: "ERR_USER_EMAIL_EXISTS"
            })
        } else {
            response.status(201).send(user)
        }
    }

    @Get(':id')
    async getUserById(@Param() params: any, @Res() response: FastifyReply) {
        const { id } = params;
        const user = await this.userService.getOneUser(id)
        if (!user) {
            response.status(400).send({
                statusCode: 400,
                message: "ERR_USER_NOT_FOUND"
            })
        } else {
            response.status(200).send({ statusCode: 200, message: 'SUCCESS', user })
        }
    }

}