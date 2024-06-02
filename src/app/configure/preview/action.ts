'use server'


import { BASE_PRICE, PRODUCT_PRICE } from '@/config/product'
import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Order, User } from '@prisma/client'

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  })
  
  if (!configuration) {
    throw new Error('No such configuration found')
  }
  
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  
  
  
  
  if (!user) {
    throw new Error('You need to be logged in')
  }
  console.log(user.id, configuration.id,user.email)

  const { finish, material } = configuration

  let price = BASE_PRICE
  if (finish === 'textured') price += PRODUCT_PRICE.finish.textured
  if (material === 'polycarbonate')
    price += PRODUCT_PRICE.material.polycarbonate

  let order: Order | undefined = undefined
  let newUser: User | undefined = undefined;

  const existingUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });
  
  if (!existingUser) {
    newUser = await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } else {
    newUser = existingUser;
  }

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  })


  if (existingOrder) {
    order = existingOrder
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
      },
    })
  }

  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [configuration.imageUrl],
    default_price_data: {
      currency: 'GBP',
      unit_amount: price,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['GB'] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  })

  return { url: stripeSession.url }
}

