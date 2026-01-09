import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TripoService {
  constructor(private configService: ConfigService) { }

  async uploadImage(file: Express.Multer.File) {
    if (!file || !file.buffer || file.size === 0) {
      throw new Error('Received empty file from client');
    }

    const apiKey = this.configService.get<string>('TRIPO_API_KEY');
    
    console.log('Upload Image Request:', {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size
    });

   
    const maxRetries = 3;
    const timeout = 120000; // 2 minutes for large files

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Upload attempt ${attempt}/${maxRetries}`);

        const formData = new FormData();
        
        const uint8Array = new Uint8Array(file.buffer);
        const blob = new Blob([uint8Array], { type: file.mimetype });
        formData.append('file', blob, file.originalname);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`Upload attempt ${attempt} timed out after ${timeout}ms`);
          controller.abort();
        }, timeout);

        console.log('Sending request to Tripo API...');
        const response = await fetch(
          'https://api.tripo3d.ai/v2/openapi/upload',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        const text = await response.text();
        console.log('Upload Response Status:', response.status);
        console.log('Upload Response:', text);

        if (!response.ok) {
          throw new Error(`Upload error ${response.status}: ${text}`);
        }

        const uploadResult = JSON.parse(text);
        console.log('Upload successful:', uploadResult);

        return uploadResult;

      } catch (error) {
        console.error(`Upload attempt ${attempt} failed:`, error.message);

        if (attempt === maxRetries) {
          throw new Error(`Upload failed after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);

        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }


  async createImageToModelTask(fileToken: string, mimeType?: string) {
    const apiKey = this.configService.get<string>('TRIPO_API_KEY');

    // Validate inputs
    if (!fileToken || typeof fileToken !== 'string') {
      throw new Error('Invalid file token provided');
    }

    let fileType: 'jpg' | 'png' = 'jpg';
    
    if (mimeType) {
      const lowerMimeType = mimeType.toLowerCase();
      if (lowerMimeType.includes('png') || lowerMimeType === 'image/png') {
        fileType = 'png';
      } else if (lowerMimeType.includes('jpg') || lowerMimeType.includes('jpeg') || 
                 lowerMimeType === 'image/jpeg' || lowerMimeType === 'image/jpg') {
        fileType = 'jpg';
      }
    }

    const requestBody = {
      type: 'image_to_model',
      file: {
        type: fileType,
        file_token: fileToken,
      },
    };



    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        'https://api.tripo3d.ai/v2/openapi/task',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      const text = await response.text();
      // console.log('Tripo API Response Status:', response.status);
      // console.log('Tripo API Response:', text);

      if (!response.ok) {
        // Check for credit issues specifically
        if (response.status === 403) {
          const errorData = JSON.parse(text);
          if (errorData.code === 2010) {
            throw new Error('Insufficient credits: Please purchase more credits from https://platform.tripo3d.ai');
          }
        }
        throw new Error(`Task error ${response.status}: ${text}`);
      }

      return JSON.parse(text);

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your network connection and try again.');
      }
      throw error;
    }
  }


  // 3GET TASK STATUS
  async getTaskStatus(taskId: string) {
    const apiKey = this.configService.get<string>('TRIPO_API_KEY');

    const controller = new AbortController();
    const timeout = 60000; // 60 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(
        `https://api.tripo3d.ai/v2/openapi/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Status error ${response.status}: ${text}`);
      }

      return JSON.parse(text);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your network connection and try again.');
      }
      throw error;
    }
  }
}
