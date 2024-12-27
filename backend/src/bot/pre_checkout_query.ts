import {Context} from 'grammy';

export const onPreCheckoutQuery = (ctx: Context) =>
  ctx.answerPreCheckoutQuery(true);

export const onSuccessfulPayment = async (ctx: Context) => {
  const successful_payment = ctx.update.business_message?.successful_payment;

  if (!successful_payment) {
    await ctx.reply('Payment hs failed failed, try another card');
  } else {
    return successful_payment;
  }
};
