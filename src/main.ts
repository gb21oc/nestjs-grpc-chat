import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const microServiceOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: "chat",
    protoPath: "./proto/chat.proto",
    url: "localhost:50051"
  }
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, microServiceOptions);
  await app.listen();
}
bootstrap();
