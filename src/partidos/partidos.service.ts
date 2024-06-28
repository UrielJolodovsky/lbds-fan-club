import { Injectable } from "@nestjs/common";
import { Partidos, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PartidosService {
    
    constructor(private prisma: PrismaService) {}
    
    async getAllPartidos(): Promise<Partidos[]> {
        return this.prisma.partidos.findMany();
    }

    async getPartidoById(id: number): Promise<Prisma.PartidosGetPayload<{ include: { borrachos: true } }> | null> {
        return this.prisma.partidos.findUnique({
            where: {
                id: id
            },
            include: {
                borrachos: true
            }
        })
    }

    async createPartido(data: Partidos): Promise<Partidos> {
        return this.prisma.partidos.create({
            data
        })
    }

    async updatePartido(id: number, data: Partidos): Promise<Partidos> {
        return this.prisma.partidos.update({
            where: {
                id: id
            },
            data
        })
    }

    async deletePartido(id: number): Promise<Partidos> {
        return this.prisma.partidos.delete({
            where: {
                id: id
            }
        })
    }

    async asignarBorrachoAPartido(idPartido: number, idBorracho: number): Promise<Partidos> {
        return this.prisma.partidos.update({
            where: {
                id: idPartido
            },
            data: {
                borrachos: {
                    connect: {
                        id: idBorracho
                    }
                }
            }
        })
    }
}