import { Module } from "@nestjs/common";
import { PartidosController } from "./partidos.controller";
import { PartidosService } from "./partidos.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers: [PartidosController],
    providers: [PartidosService],
    imports: [PrismaModule],
})
export class PartidosModule {}