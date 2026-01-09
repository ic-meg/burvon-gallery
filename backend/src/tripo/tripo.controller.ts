import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TripoService } from './tripo.service';

@Controller('tripo')
export class TripoController {
  constructor(private readonly tripoService: TripoService) { }

  /**
   * STEP 1:
   * Upload image → create image_to_model task
   */
  @Post('image-to-3d')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async imageTo3D(@UploadedFile() file: Express.Multer.File) {
    // console.log('RECEIVED FILE:', {
    //   name: file?.originalname,
    //   size: file?.size,
    //   type: file?.mimetype,
    // });

    if (!file) {
      throw new Error('No file received');
    }

    // Upload image to Tripo
    const uploadResult = await this.tripoService.uploadImage(file);

    // Create image_to_model task
    return this.tripoService.createImageToModelTask(
      uploadResult.data.image_token,
      file.mimetype, 
    );
  }

  /**
   * STEP 2:
   * Poll task status
   */
  @Get('task/:id')
  async getTaskStatus(@Param('id') id: string) {
    return this.tripoService.getTaskStatus(id);
  }
}
