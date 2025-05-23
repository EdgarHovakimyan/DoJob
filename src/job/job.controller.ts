import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import {
  AddSkillDto,
  JobFeedbackDto,
  UpdateJobDto,
  UpdateJobStatusDto,
} from './dto/update-job.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/user.enum';
import { StatusJob } from './status/status.enum';

@ApiTags('Jobs')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({ summary: 'Create a new job (Customer only)' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @Res() res: Response,
    @Req() req,
  ) {
    try {
      const data = await this.jobService.create(createJobDto, req.user._id);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'List of jobs' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.jobService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({ status: 200, description: 'Job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.jobService.findOne(id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Get jobs by status' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':status/status')
  async getJobsByStatus(
    @Param('status') status: StatusJob,
    @Res() res: Response,
  ) {
    try {
      const jobs = await this.jobService.getJobsByStatus(status);
      return res.status(HttpStatus.OK).json(jobs);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Get jobs by user ID' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':userId/user')
  async getJobsByUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const jobs = await this.jobService.getJobsByUser(userId);
      return res.status(HttpStatus.OK).json(jobs);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Update a job (Customer only)' })
  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.jobService.update(id, updateJobDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Add skills to a job (Customer only)' })
  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/add/skill')
  async addSkillsInJob(
    @Param('id') jobId: string,
    @Body() addSkillDto: AddSkillDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.jobService.addSkillsInJob(jobId, addSkillDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Remove skill from job (Customer only)' })
  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/delete/:skillId')
  async deleteSkillsInJob(
    @Param('id') jobId: string,
    @Param('skillId') skillId: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.jobService.deleteSkillsInJob(jobId, skillId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Assign freelancer to job (Customer only)' })
  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/assignFreelancer/:freelancerId')
  async assignFreelancerToJob(
    @Param('id') jobId: string,
    @Param('freelancerId') freelancerId: string,
    @Res() res: Response,
  ) {
    try {
      const updatedJob = await this.jobService.assignFreelancerToJob(
        jobId,
        freelancerId,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Freelancer assigned successfully', updatedJob });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Update job status (Customer or Freelancer)' })
  @HasRoles(Role.CUSTOMER, Role.FREELANCER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') jobId: string,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
    @Res() res: Response,
  ) {
    try {
      const updatedJob = await this.jobService.updateStatus(
        jobId,
        updateJobStatusDto.status,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Job status updated successfully', updatedJob });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Add feedback to job (Customer only)' })
  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/feedback')
  async addFeedbackToJob(
    @Param('id') id: string,
    @Body() feedbackDto: JobFeedbackDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const customerId = req.user._id;
      const updatedJob = await this.jobService.addFeedbackToJob(
        id,
        feedbackDto,
        customerId,
      );
      return res.status(HttpStatus.CREATED).json(updatedJob);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({
    summary: 'Remove freelancer request from job (Customer only)',
  })
  @HasRoles(Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/deleteFreelancerRequest/:freelancerId')
  async deleteFreelancerRequest(
    @Param('id') jobId: string,
    @Param('freelancerId') freelancerId: string,
    @Res() res: Response,
  ) {
    try {
      const updatedJob = await this.jobService.deleteFreelancerRequest(
        jobId,
        freelancerId,
      );
      return res
        .status(HttpStatus.OK)
        .json({
          message: 'Freelancer request deleted successfully',
          updatedJob,
        });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Block a job (Admin only)' })
  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/isBlock/:jobId')
  async isBlock(@Param('id') jobId: string, @Res() res: Response) {
    try {
      const updatedJob = await this.jobService.isBlock(jobId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Job is Blocked', updatedJob });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @ApiOperation({ summary: 'Delete a job (Admin or Customer)' })
  @HasRoles(Role.ADMIN, Role.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.jobService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Job deleted successfully', data });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
