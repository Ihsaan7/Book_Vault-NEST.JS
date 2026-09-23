import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseService } from './db/database.service.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService , DatabaseService],
  exports: [DatabaseService]
})
export class AppModule {}
