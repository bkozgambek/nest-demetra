import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        this.userService.create(createUserDto)
    }

}