import express, { type Request, type Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { User } from '../entity/User.js';
import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreThanOrEqual } from "typeorm";

const router = express.Router();


router.get('/users-report', async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const today = new Date();
        const startDate = subMonths(today, 11);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const users = await userRepository.find({
            where: {
                createdAt: MoreThanOrEqual(startDate),
            },
            select: {
                createdAt: true 
            }
        });

        const usersByMonth: Record<string, number> = {};

        users.forEach(user => {
            const monthKey = format(user.createdAt, 'MMMM/yyyy', { locale: ptBR }).replace('/', ' de ');
            
            if (usersByMonth[monthKey]) {
                usersByMonth[monthKey]++;
            } else {
                usersByMonth[monthKey] = 1;
            }
        });

        const result = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(new Date(), 11 - i);
            const label = format(date, 'MMMM/yyyy', { locale: ptBR }).replace('/', ' de ');

            return {
                name: label,            
                users: usersByMonth[label] || 0 
            };
        });

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;