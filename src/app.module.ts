import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseService } from './db/database.service.js';
import { DatabaseModule } from './db/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BorrowModule } from './borrows/borrow.module.js';
import { BookModule } from './books/book.module.js';

@Module({
  imports: [DatabaseModule , AuthModule , BorrowModule , BookModule],
  controllers: [AppController],
  providers: [AppService , DatabaseService],
  exports: [DatabaseService]
})
export class AppModule {}
