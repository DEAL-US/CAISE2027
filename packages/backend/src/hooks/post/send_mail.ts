import { generateOrderInvoice } from '../../workers/invoicing/index.ts';
import { sendConfirmationEmail } from '../../workers/mailing/index.ts';
import type { OrderWithRelations } from '#/types';

export default async (full_order: OrderWithRelations, email = true) => {
  const invoice_path = await generateOrderInvoice({
    order: full_order,
    vat_rate: 0
  });

  if (email) {
    const order_id = full_order.id;
    await sendConfirmationEmail({
      order_id,
      invoice_path,
      mail: {
        destination: full_order.user.email,
        subject: `[CAISE 2027 Conference - ${order_id}] Your registration has been confirmed!`,
        content: `
Thank you for registering to CAISE 2027! 🎉

Attached to this email you will find a receipt for your order.
If you need an invoice with VAT, please reply to this email

Thank you very much for joining us! 🚀
      `.trim()
      }
    });
  }
};
