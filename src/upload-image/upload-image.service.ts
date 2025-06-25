import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './upload-image.response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const streamifier = require('streamifier') as {
  createReadStream: (buffer: Buffer) => NodeJS.ReadableStream;
};


@Injectable()
export class UploadImageService {
  uploadFile(file: Express.Multer.File) : Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result: CloudinaryResponse) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }
}
