import { Module } from '@nestjs/common';
import { RouteModule } from './routes/routes.module';

@Module({
  imports: [
    RouteModule
  ],
})
export class AppModule {}
