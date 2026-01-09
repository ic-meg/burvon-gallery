import { Module } from '@nestjs/common';
import { TripoService } from './tripo.service';
import { TripoController } from './tripo.controller';

@Module({
  providers: [TripoService],
  controllers: [TripoController]
})
export class TripoModule {}
