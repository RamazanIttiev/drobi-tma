import {get, param, post, requestBody, response} from '@loopback/rest';
import {ICreatePayment, Payment} from '@a2seven/yoo-checkout';

import {v4 as uuid} from 'uuid';
import axios from 'axios';

export class PaymentController {
  constructor() {}

  @get('/getPayment/{id}')
  @response(200, {
    description: 'Yoo kassa payment',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async getPayments(
    @param.path.string('id') id: string,
  ): Promise<Payment | undefined> {
    try {
      const res = await axios.get(`https://api.yookassa.ru/v3/payments/${id}`, {
        headers: {
          'Idempotence-Key': uuid(),
        },
        auth: {
          username: process.env.YOO_KASSA_SHOP_ID ?? '',
          password: process.env.YOO_KASSA_SECRET_KEY ?? '',
        },
      });

      if (!res) {
        throw new Error('Failed to create payment');
      }

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  @post('/createPayment')
  @response(200, {
    description: 'Yoo kassa payment',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async createPayment(
    @requestBody() data: ICreatePayment,
  ): Promise<Payment | undefined> {
    try {
      const res = await axios.post(
        'https://api.yookassa.ru/v3/payments',
        data,
        {
          headers: {
            'Idempotence-Key': uuid(),
          },
          auth: {
            username: process.env.YOO_KASSA_SHOP_ID ?? '',
            password: process.env.YOO_KASSA_SECRET_KEY ?? '',
          },
        },
      );

      if (!res) {
        throw new Error('Failed to create payment');
      }

      return res.data;
    } catch (error) {
      console.log(error.response.data);
      console.log(error.config.data);
      return error.response.data;
    }
  }
}
