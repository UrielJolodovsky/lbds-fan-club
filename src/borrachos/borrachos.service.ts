import { Injectable } from "@nestjs/common";
import { Borrachos, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BorrachosService {
    constructor(private prisma: PrismaService) {}
    
    async getAllBorrachos(): Promise<Borrachos[]> {
        return this.prisma.borrachos.findMany();
    }

    async getBorrachoById(id: number): Promise<Borrachos> {
        return this.prisma.borrachos.findUnique({
            where: {
                id: id
            }
        })
    }

    async RegisterBorracho(data: Borrachos): Promise<Borrachos> {
        const dni = data.dni;
        const borracho = await this.prisma.borrachos.findUnique({
            where: {
                dni: dni
            }
        })
        if (borracho) {
            throw new Error('Ya existe un borracho con ese DNI');
        }
        return this.prisma.borrachos.create({
            data
        })
    }

    async LoginBorracho(dni: string, password: string): Promise<Borrachos> {
        const borracho = await this.prisma.borrachos.findUnique({
            where: {
                dni: Number(dni)
            }
        })
        if (!borracho) {
            throw new Error('No existe un borracho con ese DNI');
        }
        if (borracho.contrasena !== password) {
            throw new Error('Contraseña incorrecta');
        }
        return borracho;
    }

    async pagarCuota(id: number): Promise<Borrachos> {
        const borracho = await this.prisma.borrachos.findUnique({
            where: {
                id: id
            }
        })
        if (!borracho) {
            throw new Error('No existe un borracho con ese ID');
        }
        if (borracho.cuota === new Date().getMonth() + 1) {
            throw new Error('No tiene cuotas pendientes');
        }
        return this.prisma.borrachos.update({
            where: {
                id: id
            },
            data: {
                cuota: borracho.cuota + 1
            }
        })
    }

    async getBorrachosCuota(): Promise<Borrachos[]> {
        return this.prisma.borrachos.findMany({
            where: {
                cuota: new Date().getMonth() + 1
            }
        })
    }

    async asignarPartidoABorracho(idBorracho: number, idPartido: number): Promise<Borrachos> {
        return this.prisma.borrachos.update({
            where: {
                id: idBorracho
            },
            data: {
                partidos: {
                    connect: {
                        id: idPartido
                    }
                }
            }
        })
    }

    async getPartidosByBorracho(id: number): Promise<Prisma.BorrachosGetPayload<{select: {partidos: true }}>> {
        return this.prisma.borrachos.findUnique({
            where: {
                id: id
            },
            select: {
                partidos: true
            }
        })
    }
}