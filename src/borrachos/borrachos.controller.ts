import { Controller, Get, Param, Post } from "@nestjs/common";
import { BorrachosService } from "./borrachos.service";

@Controller('borrachos')
export class BorrachosController {
    
    constructor(private borrachosService: BorrachosService) {}
    @Get()
    async getAllBorrachos() {
        return this.borrachosService.getAllBorrachos();
    }

    @Get(':id')
    async getBorrachoById(@Param('id') id: number) {
        return this.borrachosService.getBorrachoById(id);
    }

    @Post('cuota/:id')
    async pagarCuota(@Param('id') id: number) {
        const borracho = await this.borrachosService.getBorrachoById(id);
        if (!borracho) {
            throw new Error('No existe un borracho con ese ID');
        }
        if (borracho.cuota === new Date().getMonth() + 1) {
            throw new Error('Ya pagaste la cuota de este mes');
        }
        return this.borrachosService.pagarCuota(id);
    }

    @Get('cuota/:id')
    async verCuota(@Param('id') id: number) {
        const borracho = await this.borrachosService.getBorrachoById(id);
        if (!borracho) {
            throw new Error('No existe un borracho con ese ID');
        }
        if (borracho.cuota === new Date().getMonth() + 1) {
            throw new Error('Tienes la cuota al día');
        }
        else {
            throw new Error(`No tienes la cuota al día, debes ${new Date().getMonth() + 1 - borracho.cuota} cuotas`);
        }
    }

    @Get('partidos/:id')
    async getPartidosByBorracho(@Param('id') id: number) {
        return this.borrachosService.getPartidosByBorracho(id);
    }
}