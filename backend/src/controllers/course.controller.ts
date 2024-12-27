import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {Course} from '../models';
import axios from 'axios';

export class CourseController {
  constructor() {}

  @get('/courses')
  @response(200, {
    description: 'Array of courses',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Course, {includeRelations: true}),
        },
      },
    },
  })
  async get(): Promise<Course[]> {
    const coursesUrl = `${process.env.AIRTABLE_URL}/Courses`;

    try {
      const res = await axios.get(coursesUrl, {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        },
      });

      return res.data.records.map((course: any) => ({
        id: course.id,
        title: course.fields.title,
        description: course.fields.description,
        image: course.fields.image?.[0]?.url || null,
      }));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  @get('/course/{id}')
  @response(200, {
    description: 'Single course',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Course, {includeRelations: true}),
      },
    },
  })
  async getById(@param.path.string('id') id: string): Promise<Course> {
    const courseUrl = `${process.env.AIRTABLE_URL}/Courses/${id}`;

    try {
      const res = await axios.get(courseUrl, {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        },
      });

      return {
        id: res.data.id,
        title: res.data.fields.title,
        description: res.data.fields.description,
        image: res.data.fields.image?.[0].url,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
