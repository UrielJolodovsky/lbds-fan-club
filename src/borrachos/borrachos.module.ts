import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { BorrachosService } from "./borrachos.service";
import { BorrachosController } from "./borrachos.controller";


@Module({
    controllers: [BorrachosController],
    providers: [BorrachosService],
    imports: [PrismaModule],
})

export class BorrachosModule {}