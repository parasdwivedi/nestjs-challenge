import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ProjectDto, dtoTask } from './dto';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {
    this.listenForEvents(); //listens for 2 events
  }

  async getProject(user: User) {
    try {
      const userId = user?.id;

      const project = await this.prisma.project.findMany({
        where: {
          userId: userId,
        },
      });

      return project;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  async createProject(dto: ProjectDto, user: User) {
    try {
      const userId = user?.id;

      const project = await this.prisma.project.create({
        data: {
          name: dto.name,
          description: dto.description,
          user: { connect: { id: userId } },
        },
      });

      return project;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
  async updateProject(id: string, dto: ProjectDto, user: User) {
    try {
      const userId = user?.id;
      const project = await this.prisma.project.update({
        where: {
          id: parseInt(id),
          userId: userId,
        },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });

      return project;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
  async deleteProject(id: string, user: User) {
    try {
      const userId = user?.id;
      const project = await this.prisma.project.delete({
        where: {
          id: parseInt(id),
          userId: userId,
        },
      });
      return project;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  async getTasks(id: string, user: User) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          projectId: parseInt(id),
        },
      });
      return tasks;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
  async createTask(id: string, dto: dtoTask, user: User) {
    try {
      const userId = user?.id;
      const project = await this.prisma.project.findFirst({
        where: {
          userId: userId,
          id: parseInt(id),
        },
      });

      const task = await this.prisma.task.create({
        data: {
          name: dto.name,
          description: dto.description,
          project: { connect: { id: project.id } },
        },
      });

      this.eventEmitter.emit('taskCreated', {
        taskId: task.id,
        projectId: project.id,
      });

      return task;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
  async updateTask(id: string, task_id: string, dto: dtoTask, user: User) {
    try {
      const userId = user?.id;
      const project = await this.prisma.project.findFirst({
        where: {
          userId: userId,
          id: parseInt(id),
        },
      });

      const updatedTask = await this.prisma.task.update({
        where: {
          id: parseInt(task_id),
          projectId: project.id,
        },
        data: {
          name: dto.name,
          description: dto.description,
          project: { connect: { id: project.id } },
        },
      });
      return updatedTask;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  async deleteTask(id: string, task_id: string, user: User) {
    try {
      const userId = user?.id;
      const project = await this.prisma.project.findFirst({
        where: {
          userId: userId,
          id: parseInt(id),
        },
      });
      const deletedTask = await this.prisma.task.delete({
        where: {
          id: parseInt(task_id),
          projectId: project.id,
        },
      });
      this.eventEmitter.emit('taskDeleted', {
        taskId: deletedTask.id,
        projectId: project.id,
      });
      return deletedTask;
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
  listenForEvents() {
    this.eventEmitter.on('taskCreated', (eventPayload) => {
      console.log('Task created event received:', eventPayload);
    });
    this.eventEmitter.on('taskDeleted', (eventPayload) => {
      console.log('Task deleted event received:', eventPayload);
    });
  }
}
