import express, { Request, Response } from 'express';
import { socketManager } from '../index';

const router = express.Router();

router.get('/api/rooms', async (req: Request, res: Response) => {
  const roomMap = socketManager.getRooms();
  const rooms = Array.from(roomMap.values()).map((room)=> ({name: room.name}))
  res.send({ rooms });
});

router.post('/api/rooms', async (req: Request, res: Response) => {
  const { socketId, roomName } = req.body;
  const room = socketManager.openRoom(socketId, roomName);
  res.send({
    response: `Room ${roomName} is opened`,
    room: { name: room.name },
  });
});

router.post('/api/rooms/join', async (req: Request, res: Response) => {
  const { socketId, roomName } = req.body;
  const room = socketManager.joinRoom(socketId, roomName);
  res.send({
    response: `Joined Room ${roomName}`,
    room: { name: roomName },
  });
});

export { router as roomRouter };
