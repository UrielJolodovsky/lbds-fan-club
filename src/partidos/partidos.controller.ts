import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PartidosService } from "./partidos.service";
import { Partidos } from "@prisma/client";
import { differenceInDays, differenceInHours } from "date-fns";
import { BorrachosService } from "src/borrachos/borrachos.service";

@Controller('partidos')
export class PartidosController {

    constructor(private partidosService: PartidosService, private borrachosService: BorrachosService) {}

    @Get()
    async getAllPartidos() {
        return this.partidosService.getAllPartidos();
    }

    @Post()
    async createPartido(@Body() data: Partidos) {
        const partidos = await this.partidosService.getAllPartidos();
        partidos.forEach(partido => {
            if (differenceInHours(new Date(partido.fecha), new Date(data.fecha)) < 72) {
                throw new Error('Ya hay un partido programado dentro de las 72hs')
            }
            if (partido.rival === data.rival && differenceInDays(new Date(partido.fecha), new Date(data.fecha)) < 30) {
                throw new Error('Ya hay un partido programado contra ese rival en un rango menor a 30 días')
            }
        })
        return this.partidosService.createPartido(data);
    }

    @Get(':id')
    async getPartidoById(@Param('id') id: string) {
        return this.partidosService.getPartidoById(Number(id));
    }

    @Delete(':id')
    async deletePartido(@Param('id') id: string) {
        return this.partidosService.deletePartido(Number(id));
    }

    @Put(':id')
    async updatePartido(@Param('id') id: string, @Body() data: Partidos) {
        const partidos = await this.partidosService.getAllPartidos();
        partidos.forEach(partido => {
            if (differenceInHours(new Date(partido.fecha), new Date(data.fecha)) < 72) {
                throw new Error('Ya hay un partido programado dentro de las 72hs')
            }
            if (partido.rival === data.rival && differenceInDays(new Date(partido.fecha), new Date(data.fecha)) < 30) {
                throw new Error('Ya hay un partido programado contra ese rival en un rango menor a 30 días')
            }
        })
        return this.partidosService.updatePartido(Number(id), data);
    }

    @Post(':idPartido/borrachos/:idBorracho')
    async asignarBorrachoAPartido(@Param('idPartido') idPartido: string, @Param('idBorracho') idBorracho: string) {
        const partido = await this.partidosService.getPartidoById(Number(idPartido));
        if (partido.cancha <= partido.borrachos.length) {
            throw new Error('La capacidad del estadio está completa')
        }
        const borracho = await this.borrachosService.getBorrachoById(Number(idBorracho));
        if (borracho.cuota !== new Date().getMonth() + 1) {
            throw new Error('El borracho no tiene la cuota al día')
        }
        return this.partidosService.asignarBorrachoAPartido(Number(idPartido), Number(idBorracho));
    }
}