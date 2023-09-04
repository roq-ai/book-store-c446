import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware, notificationHandlerMiddleware } from 'server/middlewares';
import { bookstoreValidationSchema } from 'validationSchema/bookstores';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  const allowed = await prisma.bookstore
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return getBookstoreById();
    case 'PUT':
      return updateBookstoreById();
    case 'DELETE':
      return deleteBookstoreById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBookstoreById() {
    const data = await prisma.bookstore.findFirst(convertQueryToPrismaUtil(req.query, 'bookstore'));
    return res.status(200).json(data);
  }

  async function updateBookstoreById() {
    await bookstoreValidationSchema.validate(req.body);
    const data = await prisma.bookstore.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
  async function deleteBookstoreById() {
    await notificationHandlerMiddleware(req, req.query.id as string);
    const data = await prisma.bookstore.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
