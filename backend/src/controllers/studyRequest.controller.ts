import {post, requestBody, response} from '@loopback/rest';
import axios from 'axios';
import {
  StudyRequest,
  StudyRequestResponse,
  studyRequestSuccessTypeGuard,
} from '../models';

export class StudyRequestController {
  constructor() {}

  @post('/addStudyRequest')
  @response(200, {
    description: 'Invoice Link Response',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async addStudyRequest(
    @requestBody() body: StudyRequest,
  ): Promise<StudyRequestResponse> {
    const addStudyRequestURL = `${process.env.HOLLIHOP_WEBHOOK_URL}/AddStudyRequest`;

    try {
      const res: StudyRequestResponse = await axios.post(addStudyRequestURL, {
        ...body,
        type: 'Заявка с телеграмма',
      });

      if (!studyRequestSuccessTypeGuard(res)) {
        throw new Error(`${res.message}`);
      }

      return {
        status: 'success',
        message: 'Request sent to CRM successfully',
        id: res.id,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
