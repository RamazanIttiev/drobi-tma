import {post, requestBody, response} from '@loopback/rest';
import {InvoiceBody} from '../models';
import {bot} from '../bot';

export class InvoiceController {
  constructor() {}

  @post('/createInvoiceLink')
  @response(200, {
    description: 'Invoice Link Response',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async createInvoiceLink(
    @requestBody() body: InvoiceBody,
  ): Promise<string | void> {
    const {
      title,
      description,
      payload,
      provider_token,
      currency,
      prices,
      send_phone_number_to_provider,
      need_phone_number,
      need_name,
    } = body;
    try {
      return await bot.api
        .createInvoiceLink(
          title,
          description,
          payload,
          provider_token,
          currency,
          prices,
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            send_phone_number_to_provider,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            need_phone_number,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            need_name,
          },
        )
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      throw new Error(`Error creating invoice link: ${err.message || err}`);
    }
  }
}
