import { GetUser } from './../auth/decorator/get-user.decorator';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { User } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects-tasks.service';
import { ProjectDto, dtoTask } from './dto';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Get()
  getProject(@GetUser() user: User) {
    return this.projectService.getProject(user);
  }

  @Post()
  createProject(@Body() dto: ProjectDto, @GetUser() user: User) {
    return this.projectService.createProject(dto, user);
  }

  @Put(':project_id')
  updateProject(
    @Param('project_id') id: string,
    @Body() dto: ProjectDto,
    @GetUser() user: User,
  ) {
    return this.projectService.updateProject(id, dto, user);
  }

  @Delete(':project_id')
  deleteProject(@Param('project_id') id: string, @GetUser() user: User) {
    return this.projectService.deleteProject(id, user);
  }

  @Get(':project_id/tasks')
  getTasks(@Param('project_id') id: string, @GetUser() user: User) {
    return this.projectService.getTasks(id, user);
  }

  @Post(':project_id/tasks')
  createTask(
    @Param('project_id') id: string,
    @Body() dto: dtoTask,
    @GetUser() user: User,
  ) {
    return this.projectService.createTask(id, dto, user);
  }

  @Put(':project_id/tasks/:tasks_id')
  updateTask(
    @Param('project_id') id: string,
    @Param('tasks_id') task_id: string,
    @Body() dto: dtoTask,
    @GetUser() user: User,
  ) {
    return this.projectService.updateTask(id, task_id, dto, user);
  }
  @Delete(':project_id/tasks/:tasks_id')
  deleteTask(
    @Param('project_id') id: string,
    @Param('tasks_id') task_id: string,
    @GetUser() user: User,
  ) {
    return this.projectService.deleteTask(id, task_id, user);
  }
}
