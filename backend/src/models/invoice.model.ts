import {Entity, model, property} from '@loopback/repository';

interface Prices {
  label: string;
  amount: number;
}

export interface InvoiceLinkResponse {
  status: number;
  statusText: string;
  data: {
    ok: string;
    result: string;
  };
}

@model()
export class InvoiceLink extends Entity {
  @property({
    type: 'object',
    required: true,
  })
  url: InvoiceLinkResponse;

  constructor(data?: Partial<InvoiceLink>) {
    super(data);
  }
}

@model()
export class InvoiceBody extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  payload: string;

  @property({
    type: 'string',
    required: true,
  })
  currency: string;

  @property({
    type: 'string',
    required: true,
  })
  provider_token: string;

  @property({
    type: 'array',
    itemType: 'any',
  })
  prices: Prices[];

  @property({
    type: 'string',
  })
  send_phone_number_to_provider?: string;

  @property({
    type: 'string',
  })
  need_phone_number?: string;

  @property({
    type: 'string',
  })
  need_name?: string;

  constructor(data?: Partial<InvoiceBody>) {
    super(data);
  }
}
