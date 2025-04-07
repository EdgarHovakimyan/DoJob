import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillsSchema } from 'src/skills/entities/skill.entity';
import { FreelancerSchema } from 'src/freelancer/entities/freelancer.entity';
import { CustomerSchema } from 'src/customer/entities/customer.entity';
import { JobSchema } from './entities/job.entity';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [MongooseModule.forFeature([
    { name: "Job", schema: JobSchema },
    { name: "Customer", schema: CustomerSchema },
    { name: "Skills", schema: SkillsSchema },
    { name: "Freelancer", schema: FreelancerSchema }
  ])],
})
export class JobModule { }
