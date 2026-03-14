import prisma from '../infra/prisma/prismaClient.js';

const periodoContableRepository = {
  async existsClosedPeriods() {
    try {
      const count = await prisma.periodoContable.count({
        where: {
          estado: 'CERRADO',
        },
      });

      return count > 0;
    } catch {
      return false;
    }
  },
};

export default periodoContableRepository;
