import { Router } from 'express';
import { PresentationController } from '../controllers/PresentationController';

const router = Router();
const presentationController = new PresentationController();

// Generate presentation
router.post('/generate', presentationController.generatePresentation);

// Download presentation
router.get('/download/:filename', presentationController.downloadPresentation);

export { router as presentationRoutes };
