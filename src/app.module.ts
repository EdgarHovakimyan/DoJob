import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { CustomerModule } from './customer/customer.module';
import { SkillsModule } from './skills/skills.module';
import { FreelancerModule } from './freelancer/freelancer.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/up-work'),
    UserModule,
    JobModule,
    CustomerModule,
    SkillsModule,
    FreelancerModule
  ],
})

export class AppModule { }
