import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'), //get connected to the database with this url. See env file
        },
      },
    });
  }

  //to delete Data everytime before the app starts or before the test starts
  cleandb() {
    return this.$transaction([
      this.task.deleteMany(), //task gets deleted first
      this.project.deleteMany(), //project after that
      this.user.deleteMany(), //user in last just to avoid errors as they are interlinked
    ]);
  }
}
