import express, { type Request, type Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { User } from '../entity/User.js';
const router = express.Router();


router.get('/users', async (req: Request, res: Response) => {
   try{
      const userRepository = AppDataSource.getRepository(User);
      const users =  await userRepository.find();
      res.json(users);
   }catch(error){
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

router.get("/users/:id", async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({ message: 'Invalid user id' });
      }
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: parseInt(id, 10) });
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
   }
});

router.post('/users', async (req: Request, res: Response) => {
   try {
      var data = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email: data.email } });

      if (existingUser) {
         return res.status(400).json({ message: 'Email already in use' });
      }
      const newUser = userRepository.create(data);
      await userRepository.save(newUser);
      res.status(201).json({
         message: 'User created successfully',
         user: newUser
      });

   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
   }
});



export default router;