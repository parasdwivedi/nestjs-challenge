import { signInDto } from './../src/auth/dto/signin.dto';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { PrismaService } from './../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { ProjectDto, dtoTask } from 'src/projects/dto';

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // so that only the data fields which are mentioned are accounted for
      }),
    ); //to validate the data coming in the request
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    // await prisma.cleandb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const signUpDto: AuthDto = {
      email: 'paras@aadmin.com',
      password: '123',
      firstName: 'Paras',
      lastName: 'Dwivedi',
    };
    const signInDto: signInDto = {
      email: 'paras@aadmin.com',
      password: '123',
    };
    describe('Sign Up', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: signUpDto.password })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: signUpDto.email })
          .expectStatus(400);
      });
      it('should throw error if firstName is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: signUpDto.email,
            password: signUpDto.password,
            lastName: signUpDto.lastName,
          })
          .expectStatus(400);
      });
      it('should throw error if lastName is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: signUpDto.email,
            password: signUpDto.password,
            firstName: signUpDto.firstName,
          })
          .expectStatus(400);
      });
      it('should throw error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signUpDto)
          .expectStatus(403);
      });
    });

    describe('Sign In', () => {
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .expectStatus(201)
          .stores('token', 'access_token');
      });
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: signInDto.password })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: signInDto.email })
          .expectStatus(400);
      });
      it('should throw error if email and password are empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Projects', () => {
    const projectDto: ProjectDto = {
      name: 'My Project',
      description: 'Project of DParas',
    };
    const updatedDto: ProjectDto = {
      name: 'Updated Project',
      description: 'Updated Project of DParas',
    };
    describe('Get Projects', () => {
      it('should get projects', () => {
        return pactum
          .spec()
          .get('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200);
      });
    });

    describe('Create Projects', () => {
      it('should throw error if name is empty', () => {
        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ description: projectDto.description })
          .expectStatus(400);
      });
      it('should throw error if description is empty', () => {
        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ name: projectDto.name })
          .expectStatus(400);
      });
      it('should throw error if project body is empty', () => {
        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({})
          .expectStatus(400);
      });
      it('should create projects', () => {
        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody(projectDto)
          .expectStatus(201);
      });
    });

    describe('Edit Projects', () => {
      it('should throw error if name is empty', () => {
        return pactum
          .spec()
          .put('/projects/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ description: projectDto.description })
          .expectStatus(400);
      });
      it('should throw error if description is empty', () => {
        return pactum
          .spec()
          .put('/projects/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ name: projectDto.name })
          .expectStatus(400);
      });
      it('should throw error if project body is empty', () => {
        return pactum
          .spec()
          .put('/projects/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({})
          .expectStatus(400);
      });
      it('should edit project', () => {
        return pactum
          .spec()
          .put('/projects/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody(updatedDto)
          .expectStatus(200);
      });
    });

    describe('Delete Projects', () => {
      // it('should delete project', () => {
      //   return pactum
      //     .spec()
      //     .delete('/projects/15')
      //     .withHeaders({
      //       Authorization: 'Bearer $S{token}',
      //     })
      //     .expectStatus(200);
      // });
    });
  });

  describe('Tasks', () => {
    const taskDto: dtoTask = {
      name: 'taskitask',
      description: 'wallah eine Task',
    };
    const editedTaskDto: dtoTask = {
      name: 'edited task',
      description: 'wallah eine edit',
    };
    describe('Get Tasks', () => {
      it('should get tasks', () => {
        return pactum
          .spec()
          .get('/projects/1/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200);
      });
    });

    describe('Create Tasks', () => {
      it('should throw error if name is empty', () => {
        return pactum
          .spec()
          .post('/projects/1/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ description: taskDto.description })
          .expectStatus(400);
      });
      it('should throw error if description is empty', () => {
        return pactum
          .spec()
          .post('/projects/1/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ name: taskDto.name })
          .expectStatus(400);
      });
      it('should throw error if project body is empty', () => {
        return pactum
          .spec()
          .post('/projects/1/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({})
          .expectStatus(400);
      });
      it('should create tasks', () => {
        return pactum
          .spec()
          .post('/projects/1/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody(taskDto)
          .expectStatus(201);
      });
    });

    describe('Edit Tasks', () => {
      it('should throw error if name is empty', () => {
        return pactum
          .spec()
          .put('/projects/1/tasks/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ description: editedTaskDto.description })
          .expectStatus(400);
      });
      it('should throw error if description is empty', () => {
        return pactum
          .spec()
          .put('/projects/1/tasks/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({ name: editedTaskDto.name })
          .expectStatus(400);
      });
      it('should throw error if project body is empty', () => {
        return pactum
          .spec()
          .put('/projects/1/tasks/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({})
          .expectStatus(400);
      });
      it('should edit tasks', () => {
        return pactum
          .spec()
          .put('/projects/1/tasks/2')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody(editedTaskDto)
          .expectStatus(200);
      });
    });

    describe('Delete Tasks', () => {
      // it('should delete Task', () => {
      //   return pactum
      //     .spec()
      //     .delete('/projects/14/tasks/4')
      //     .withHeaders({
      //       Authorization: 'Bearer $S{token}',
      //     })
      //     .withBody(editedTaskDto)
      //     .expectStatus(200);
      // });
    });
  });
});
