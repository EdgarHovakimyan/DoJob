import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobFeedbackDto, UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './entities/job.entity';
import { Model } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
import { Freelancer } from 'src/freelancer/entities/freelancer.entity';
import { Skills } from 'src/skills/entities/skill.entity';
import { StatusJob } from './status/status.enum';

@Injectable()
export class JobService {
  save(createJobDto: CreateJobDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel("Job") private jobModel: Model<Job>,
    @InjectModel('Customer') private customerModel: Model<Customer>,
    @InjectModel('Freelancer') private freelancerModel: Model<Freelancer>,
    @InjectModel('Skills') private skillModel: Model<Skills>,
  ) { }

  async create(createJobDto: CreateJobDto) {
    const { title, description, deadline, customerId, skills } =
      createJobDto;

    const customer = await this.customerModel.findById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const foundSkills = await this.skillModel.find({
      _id: { $in: skills },
    });

    if (foundSkills.length !== skills.length) {
      throw new NotFoundException('Some skills not found');
    }

    const jobData = {
      title,
      description,
      deadline,
      customerId,
      skills: foundSkills.map((skill) => skill._id),
    };

    return await this.jobModel.create(jobData);
  }

  async findAll() {
    return await this.jobModel.find();
  }

  async findOne(id: string) {
    return await this.jobModel.findOne({ where: { id } });
  }

  async getJobsByStatus(status: StatusJob): Promise<Job[]> {
    let filter = {};

    if (status !== undefined) {
      filter = { status };
    }

    return this.jobModel.find(filter).exec();
  }

  async getJobsByUser(userId: string, userType: 'customer' | 'freelancer'): Promise<Job[]> {  
    if (userType === 'customer') {
      return await this.jobModel.find({ customerId: userId });
    } else if (userType === 'freelancer') {
      return await this.jobModel.find({ freelancer: userId });
    }

    return [];
  }

  async startJob(jobId: string): Promise<Job> {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status === StatusJob.START) {
      job.status = StatusJob.PROCESS;
      await job.save();
    }

    return job;
  }

  async finishJob(jobId: string): Promise<Job> {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status === StatusJob.PROCESS) {
      job.status = StatusJob.END;
      await job.save();
    }

    return job;
  }
  
  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job not found`);
    }

    if (updateJobDto.skills) {
      const skills = await this.skillModel
        .find({ _id: { $in: updateJobDto.skills } })
        .exec();
      if (skills.length !== updateJobDto.skills.length) {
        throw new NotFoundException('Some skills not found');
      }
      job.skills = skills;
    }

    return this.jobModel.findByIdAndUpdate(id, updateJobDto);
  }

  async assignFreelancerToJob(jobId: string, freelancerId: string): Promise<Job> {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.freelancer = freelancerId;

    await job.save();
    return job;
  }


  async updateStatus(jobId: string, status: StatusJob): Promise<Job> {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    job.status = status;

    await job.save();
    return job;
  }

  async addFeedbackToJob(id: string, feedbackDto: JobFeedbackDto): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    if (job.status !== 2) {
      throw new NotFoundException('Job is not completed yet');
    }

    job.feedback = {
      rate: feedbackDto.rate,
      text: feedbackDto.text,
    };

    await job.save();

    return job;
  }

  async deleteFreelancerRequest(jobId: string, freelancerId: string): Promise<Job> {
    const job = await this.jobModel.findById(jobId);  

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const requestIndex = job.requestFreelancer.findIndex(
      (Request) => Request.toString() === freelancerId,
    );

    if (requestIndex === -1) {
      throw new NotFoundException('Freelancer Request not found');
    }

    job.requestFreelancer.splice(requestIndex, 1);

    await job.save();
    return job;  
  }

  async remove(id: string) {
    const us = await this.jobModel.findById({ where: { id } });
    if (!us) {
      return false;
    }
    await this.jobModel.findByIdAndDelete(us);
    return true;
  }
}
