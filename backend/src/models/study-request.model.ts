import {Entity, model, property} from '@loopback/repository';

@model()
export class StudyRequest extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'string',
    required: true,
  })
  eMail: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: false,
  })
  type?: string;

  constructor(data?: Partial<StudyRequest>) {
    super(data);
  }
}

export interface StudyRequestRelations {
  // describe navigational properties here
}

export type StudyRequestWithRelations = StudyRequest & StudyRequestRelations;

export interface StudyRequestSuccessResponse {
  status: string;
  message: string;
  id: string;
}

export interface StudyRequestErrorResponse {
  status: string;
  message: string;
}

export type StudyRequestResponse =
  | StudyRequestSuccessResponse
  | StudyRequestErrorResponse;

export const studyRequestSuccessTypeGuard = (
  data: StudyRequestResponse,
): data is StudyRequestSuccessResponse => {
  return !('error' in data);
};
