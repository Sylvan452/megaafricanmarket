import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event); // Call the handler only if the click is outside of the element passed.
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Reload only if ref or handler changes
};

<svg
    viewBox='0 0 20 20'
    fill='currentColor'
    aria-hidden='true'
    className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'>
    <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
</svg>

const webhookRequest = req as any as WebhookRequest
const body = webhookRequest.rawBody
const signature = req.headers['stripe-signature'] || ''

let event
try {
event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
)
} catch (err) {
return res
    .status(400)
    .send(
    `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`
    )
}

const session = event.data.object as Stripe.Checkout.Session

if (!session?.metadata?.userId || !session?.metadata?.orderId) {
return res.status(400).send(`Webhook Error: No user present in metadata`)
}

if (event.type === 'checkout.session.completed') {
const payload = await getPayloadClient()

const { docs: users } = await payload.find({
    collection: 'users',
    where: {
    id: {
        equals: session.metadata.userId,
    },
    },
})

const [user] = users

if (!user) return res.status(404).json({ error: 'No such user exists.' })

const { docs: orders } = await payload.find({
    collection: 'orders',
    depth: 2,
    where: {
    id: {
        equals: session.metadata.orderId,
    },
    },
})

const [order] = orders

if (!user) return res.status(404).json({ error: 'No such order exists.' })

await payload.update({
    collection: 'orders',
    data: {
    _isPaid: true,
    },
    where: {
    id: {
        equals: session.metadata.orderId,
    },
    },
})

// send receipt
try {
    const data = await resend.emails.send({
    from: 'DigitalHippo <info@megaafricanmarket.com>',
    to: [user.email],
    subject: 'Thanks for your order! This is your receipt.',
    html: ReceiptEmailHtml({
        date: new Date(),
        email: user.email,
        orderId: session.metadata.orderId,
        products: order.products as Product[],
    }),
    })
    res.status(200).json({ data })
} catch (error) {
    res.status(500).json({ error })
}
}

return res.status(200).send()


<Html>
    <Head />
    <Preview>Your Mega African Market Receipt</Preview>

    <Body style={main}>
    <Container style={container}>
        <Section>
        <Column>
            <Img
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-email-sent.png`}
            width='100'
            height='100'
            alt='MegaAfricanMarket'
            />
        </Column>

        <Column align='right' style={tableCell}>
            <Text style={heading}>Receipt</Text>
        </Column>
        </Section>
        <Section style={informationTable}>
        <Row style={informationTableRow}>
            <Column style={informationTableColumn}>
            <Text style={informationTableLabel}>EMAIL</Text>
            <Link
                style={{
                ...informationTableValue,
                }}>
                {email}
            </Link>
            </Column>

            <Column style={informationTableColumn}>
            <Text style={informationTableLabel}>INVOICE DATE</Text>
            <Text style={informationTableValue}>
                {format(date, 'dd MMM yyyy')}
            </Text>
            </Column>

            <Column style={informationTableColumn}>
            <Text style={informationTableLabel}>ORDER ID</Text>
            <Link
                style={{
                ...informationTableValue,
                }}>
                {orderId}
            </Link>
            </Column>
        </Row>
        </Section>
        <Section style={productTitleTable}>
        <Text style={productsTitle}>Order Summary</Text>
        </Section>
        {products.map((product) => {
        const { image } = product.images[0]

        return (
            <Section key={product.id}>
            <Column style={{ width: '64px' }}>
                {typeof image !== 'string' && image.url ? (
                <Img
                    src={image.url}
                    width='64'
                    height='64'
                    alt='Product Image'
                    style={productIcon}
                />
                ) : null}
            </Column>
            <Column style={{ paddingLeft: '22px' }}>
                <Text style={productTitle}>{product.name}</Text>
                {product.description ? (
                <Text style={productDescription}>
                    {product.description.length > 50
                    ? product.description?.slice(0, 50) + '...'
                    : product.description}
                </Text>
                ) : null}
                <Link
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`}
                style={productLink}>
                Download Asset
                </Link>
            </Column>

            <Column style={productPriceWrapper} align='right'>
                <Text style={productPrice}>{formatPrice(product.price)}</Text>
            </Column>
            </Section>
        )
        })}

        <Section>
        <Column style={{ width: '64px' }}></Column>
        <Column style={{ paddingLeft: '40px', paddingTop: 20 }}>
            <Text style={productTitle}>Transaction Fee</Text>
        </Column>

        <Column style={productPriceWrapper} align='right'>
            <Text style={productPrice}>{formatPrice(1)}</Text>
        </Column>
        </Section>

        <Hr style={productPriceLine} />
        <Section align='right'>
        <Column style={tableCell} align='right'>
            <Text style={productPriceTotal}>TOTAL</Text>
        </Column>
        <Column style={productPriceVerticalLine}></Column>
        <Column style={productPriceLargeWrapper}>
            <Text style={productPriceLarge}>{formatPrice(total)}</Text>
        </Column>
        </Section>
        <Hr style={productPriceLineBottom} />

        <Text style={footerLinksWrapper}>
        <Link href='#'>Account Settings</Link> •{' '}
        <Link href='#'>Terms of Sale</Link> •{' '}
        <Link href='#'>Privacy Policy </Link>
        </Text>
        <Text style={footerCopyright}>
        Copyright © 2023 Mega African Market Inc. <br />{' '}
        <Link href='#'>All rights reserved</Link>
        </Text>
    </Container>
    </Body>
</Html>

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: '#ffffff',
}

const resetText = {
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '660px',
}

const tableCell = { display: 'table-cell' }

const heading = {
  fontSize: '28px',
  fontWeight: '300',
  color: '#888888',
}

const informationTable = {
  borderCollapse: 'collapse' as const,
  borderSpacing: '0px',
  color: 'rgb(51,51,51)',
  backgroundColor: 'rgb(250,250,250)',
  borderRadius: '3px',
  fontSize: '12px',
  marginTop: '12px',
}

const informationTableRow = {
  height: '46px',
}

const informationTableColumn = {
  paddingLeft: '20px',
  borderStyle: 'solid',
  borderColor: 'white',
  borderWidth: '0px 1px 1px 0px',
  height: '44px',
}

const informationTableLabel = {
  ...resetText,
  color: 'rgb(102,102,102)',
  fontSize: '10px',
}

const informationTableValue = {
  fontSize: '12px',
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
}

const productTitleTable = {
  ...informationTable,
  margin: '30px 0 15px 0',
  height: '24px',
}

const productsTitle = {
  background: '#fafafa',
  paddingLeft: '10px',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const productIcon = {
  margin: '0 0 0 20px',
  borderRadius: '14px',
  border: '1px solid rgba(128,128,128,0.2)',
}

const productTitle = {
  fontSize: '12px',
  fontWeight: '600',
  ...resetText,
}

const productDescription = {
  fontSize: '12px',
  color: 'rgb(102,102,102)',
  ...resetText,
}

const productLink = {
  fontSize: '12px',
  color: 'rgb(0,112,201)',
  textDecoration: 'none',
}

const productPriceTotal = {
  margin: '0',
  color: 'rgb(102,102,102)',
  fontSize: '10px',
  fontWeight: '600',
  padding: '0px 30px 0px 0px',
  textAlign: 'right' as const,
}

const productPrice = {
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
}

const productPriceLarge = {
  margin: '0px 20px 0px 0px',
  fontSize: '16px',
  fontWeight: '600',
  whiteSpace: 'nowrap' as const,
  textAlign: 'right' as const,
}

const productPriceWrapper = {
  display: 'table-cell',
  padding: '0px 20px 0px 0px',
  width: '100px',
  verticalAlign: 'top',
}

const productPriceLine = { margin: '30px 0 0 0' }

const productPriceVerticalLine = {
  height: '48px',
  borderLeft: '1px solid',
  borderColor: 'rgb(238,238,238)',
}

const productPriceLargeWrapper = {
  display: 'table-cell',
  width: '90px',
}

const productPriceLineBottom = { margin: '0 0 75px 0' }

const footerLinksWrapper = {
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
}

const footerCopyright = {
  margin: '25px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
}

"build:payload": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload build",
"build:server": "tsc --project tsconfig.server.json",
"build:next": "cross-env PAYLOAD_CONFIG_PATH=dist/payload.config.js NEXT_BUILD=true node dist/server.js",
"build": "cross-env NODE_ENV=production yarn build:payload && yarn build:server && yarn copyfiles && yarn build:next",
"start": "cross-env PAYLOAD_CONFIG_PATH=dist/payload.config.js NODE_ENV=production node dist/server.js",
"copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png}\" dist/",


<Html>
<Head />
<Preview>Your Ultimate One-Stop Shop for Quality African & Caribbean Groceries!</Preview>
<Body style={main}>
    <Container style={container}>
    <Img
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-newsletter-sign-up.png`}
        width="150"
        height="150"
        alt="DigitalHippo"
        style={logo}
    />
    <Text style={paragraph}>Hi there,</Text>
    <Text style={paragraph}>
        Welcome to Mega African Market, Your Ultimate One-Stop Shop for Quality African & Caribbean Groceries! {actionLabel}.
    </Text>
    <Section style={btnContainer}>
        <Button style={button} href={href}>
        {buttonText}
        </Button>
    </Section>
    <Text style={paragraph}>
        Best,
        <br />
        The Mega African Market team
    </Text>
    <Hr style={hr} />
    <Text style={footer}>
        If you did not request this email, you can safely ignore it.
    </Text>
    </Container>
</Body>
</Html>


const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  padding: "12px 12px",
  backgroundColor: "#2563eb",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};


export function constructMetadata({
  title = 'Mega African Market - Your Ultimate One-Stop Shop for Quality African & Caribbean Groceries!',
  description = Your Ultimate One-Stop Shop for Quality African & Caribbean Groceries!',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@sylvan452',
    },
    icons,
    metadataBase: new URL('https://megaafricanmarket.com'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}