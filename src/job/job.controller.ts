import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobFeedbackDto, UpdateJobDto, UpdateJobStatusDto } from './dto/update-job.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/user.enum';
import { StatusJob } from './status/status.enum';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post()
  async create(@Body() createJobDto: CreateJobDto, @Res() res: Response) {
    try {
      const data = await this.jobService.save(createJobDto);
      return res.status(HttpStatus.CREATED).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message })
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.jobService.findAll();
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message })
    }
  }

  @Get()
  async getJobs(@Param('status') status: StatusJob, @Res() res: Response) {
    try {
      const jobs = await this.jobService.getJobsByStatus(status);
      return res.status(HttpStatus.OK).json(jobs);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.jobService.findOne(id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: e.message })
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':jobId/start')
  async startJob(@Param('jobId') jobId: string, @Res() res: Response) {
    try {
      const job = await this.jobService.startJob(jobId);
      return res.status(HttpStatus.OK).json(job);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch(':jobId/finish')
  async finishJob(@Param('jobId') jobId: string, @Res() res: Response) {
    try {
      const job = await this.jobService.finishJob(jobId);
      return res.status(HttpStatus.OK).json(job);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Res() res: Response) {
    try {
      const data = await this.jobService.update(id, updateJobDto);
      return res.status(HttpStatus.CREATED).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message })
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/assignFreelancer/:freelancerId')
  async assignFreelancer(@Param('id') jobId: string, @Param('freelancerId') freelancerId: string, @Res() res: Response ) {
    try {
      const updatedJob = await this.jobService.assignFreelancerToJob(jobId, freelancerId);
      return res.status(HttpStatus.OK).json(updatedJob);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/status')
  async updateJobStatus(@Param('id') jobId: string, @Body() updateJobStatusDto: UpdateJobStatusDto, @Res() res: Response) {
    try {
      const updatedJob = await this.jobService.updateStatus(jobId, updateJobStatusDto.status);
      return res.status(HttpStatus.OK).json(updatedJob);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/feedback')
  async addFeedback(@Param('id') id: string, @Body() jobFeedbackDto: JobFeedbackDto, @Res() res: Response) {
    try {
      const job = await this.jobService.addFeedbackToJob(id, jobFeedbackDto);
      return res.status(HttpStatus.CREATED  ).json(job);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/deleteApplication/:freelancerId')
  async deleteRequest(@Param('id') jobId: string, @Param('freelancerId') freelancerId: string, @Res() res: Response) {
    try {
      const updatedJob = await this.jobService.deleteFreelancerRequest(jobId, freelancerId);
      return res.status(HttpStatus.CREATED).json(updatedJob);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.jobService.remove(id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message })
    }
  }
}
