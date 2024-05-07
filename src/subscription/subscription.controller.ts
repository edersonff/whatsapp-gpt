import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import Stripe from 'stripe';

const endpointSecret =
  'whsec_8470253074195fcadabae578ce72fc99e4a5215bac5c101f77a1ce6987510acf';

@Controller('subscription')
export class SubscriptionController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('webhook')
  webwook(@Request() request) {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        request.body,
        sig,
        endpointSecret,
      );
    } catch (err) {
      return new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        console.log(
          'checkout.session.async_payment_failed',
          checkoutSessionAsyncPaymentFailed,
        );
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        console.log(
          'checkout.session.async_payment_succeeded',
          checkoutSessionAsyncPaymentSucceeded,
        );
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        console.log('checkout.session.completed', checkoutSessionCompleted);
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        console.log('checkout.session.expired', checkoutSessionExpired);
        // Then define and call a function to handle the event checkout.session.expired
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return { received: true };
  }
}
