import { Module } from '@nestjs/common';
import { ProjectsController } from './projects-tasks.controller';
import { ProjectsService } from './projects-tasks.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
