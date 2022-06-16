import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReconModule } from './recon/recon.module';

@Module({
  imports: [ReconModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
