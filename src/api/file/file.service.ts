import { BadRequestException, Injectable } from '@nestjs/common';
import { path as rootPath } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import path from 'path';
import { FileResponse } from '../../common/interfaces';

@Injectable()
export class FileService {
  async upload(files: Express.Multer.File[], folder: string = 'products') {
    if (!files) throw new BadRequestException('No files to upload');
    const uploadDir = `${rootPath}/uploads/${folder}`;
    await ensureDir(uploadDir);
    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const originalFilename = path.parse(file.originalname).name;
        const extention = path.parse(file.originalname).ext;
        const filename = `${originalFilename}-${Date.now()}${extention}`;
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, file.buffer);
        return {
          url: path.join('/uploads', folder, filename),
          name: filename,
        };
      }),
    );
    return response;
  }
}
