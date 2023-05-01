import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Strings } from '../constants';
import { extname } from 'path';

export class ImageValidationPipe implements PipeTransform {
  async transform(value: any) {
    if (!value) {
      throw new BadRequestException(Strings.UPLOADED_FILE_NOT_FOUND_EXCEPTION);
    }
    const { size, mimetype, originalname } = value;

    if (!size || !mimetype || !originalname) {
      throw new BadRequestException(Strings.UNPROCESSABLE_FILE_EXCEPTION);
    }

    // Validate file size - 100 Mb
    if (size > 100 * 1024 * 1024) {
      throw new BadRequestException(Strings.TOO_LARGE_FILE_EXCEPTION);
    }

    // Validate file extension
    const allowedExtensions = ['.jpeg', '.jpg', '.png'];
    const fileExtension = extname(originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(Strings.INVALID_FILE_EXTENSION);
    }

    return value;
  }
}
