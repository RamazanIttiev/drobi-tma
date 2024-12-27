import {Bot} from 'grammy';
import dotenv from 'dotenv';
import {
  onPreCheckoutQuery,
  onSuccessfulPayment,
} from './bot/pre_checkout_query';

dotenv.config();

export const bot = new Bot(process.env.TELEGRAM_API_TOKEN ?? '');

bot.command('start', ctx => ctx.reply('Welcome! Up and running.'));

bot.on('pre_checkout_query', async ctx => {
  await onPreCheckoutQuery(ctx);
});

bot.on('business_message:successful_payment', async ctx => {
  await onSuccessfulPayment(ctx);
});

void bot.start();
