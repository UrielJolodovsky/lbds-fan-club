import { Module } from '@nestjs/common';
import { PartidosModule } from './partidos/partidos.module';
import { BorrachosModule } from './borrachos/borrachos.module';

@Module({
  imports: [PartidosModule, BorrachosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
