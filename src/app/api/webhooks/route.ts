import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  console.log("Received webhook: ", await req.text());
  try {
    const body = await req.text();
    // Headers retrieval needs to use req.headers.get instead of headers()
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return new Response('Invalid signature', { status: 400 });
    }

    // Construct the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.error('Error verifying Stripe signature:', error);
      return new Response('Webhook Error: Signature verification failed', { status: 400 });
    }

    // Log the event type to confirm receipt and correct parsing
    console.log("Event type:", event.type);

    // Optionally handle the event type
    if (event.type === 'checkout.session.completed') {
      console.log("Handling checkout.session.completed");
      // Here you could further decode and log the event data
      // For simplicity, just logging the existence of necessary details
      if (!event.data.object.customer_details?.email) {
        console.error('Missing user email in webhook data');
        return new Response('Webhook Error: Missing user email', { status: 400 });
      }
    }

    // Return a success response for the webhook received
    return NextResponse.json({ message: 'Webhook received and processed successfully', ok: true });

  } catch (err) {
    console.error('Unhandled error in webhook:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', ok: false }), { status: 500 });
  }
}


// export async function POST(req: Request) {
//   console.log("Received webhook: ", await req.text());
//   try {
//     const body = await req.text()
//     const signature = headers().get('stripe-signature')

//     if (!signature) {
//       return new Response('Invalid signature', { status: 400 })
//     }

//     const event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     )

//     if (event.type === 'checkout.session.completed') {
//       if (!event.data.object.customer_details?.email) {
//         throw new Error('Missing user email')
//       }

//       const session = event.data.object as Stripe.Checkout.Session

//       const { userId, orderId } = session.metadata || {
//         userId: null,
//         orderId: null,
//       }

//       if (!userId || !orderId) {
//         throw new Error('Invalid request metadata')
//       }

//       const billingAddress = session.customer_details!.address
//       const shippingAddress = session.shipping_details!.address

//       const updatedOrder = await db.order.update({
//         where: {
//           id: orderId,
//         },
//         data: {
//           isPaid: true,
//           shippingAddress: {
//             create: {
//               name: session.customer_details!.name!,
//               city: shippingAddress?.city!,
//               country: shippingAddress!.country!,
//               postalCode: shippingAddress!.postal_code!,
//               street: shippingAddress!.line1!,

//             },
//           },
//           billingAddress: {
//             create: {
//               name: session.customer_details!.name!,
//               city: billingAddress!.city!,
//               country: billingAddress!.country!,
//               postalCode: billingAddress!.postal_code!,
//               street: billingAddress!.line1!,

//             },
//           },
//         },
//       })


//     }

//     return NextResponse.json({ result: event, ok: true })
//   } catch (err) {
//     console.error(err)

//     return NextResponse.json(
//       { message: 'Something went wrong', ok: false },
//       { status: 500 }
//     )
//   }
// }

