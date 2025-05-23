import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';


export class UpdateFreelancerSalaryDto {
  @ApiProperty()
  @JoiSchema(Joi.number().integer())
  salary: number;

}
export class UpdateFreelancerSkillDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  skillId: string;
}
export class DeleteFreelancerSkillDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  skillId: string;
}


