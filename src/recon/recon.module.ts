import { Module } from '@nestjs/common';
import { ReconGateway } from './recon.gateway';

@Module({
  providers: [ReconGateway]
})
export class ReconModule {}
