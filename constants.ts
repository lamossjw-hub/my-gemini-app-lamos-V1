
import { ImageSizeOption } from './types';

export const IMAGE_SIZE_OPTIONS: ImageSizeOption[] = [
  { label: '1024x1024 (Square)', value: '1024x1024', aspectRatio: '1:1', imageSize: '1K' },
  { label: '1080x1920 (Portrait)', value: '1080x1920', aspectRatio: '9:16', imageSize: '2K' },
  { label: '2160x2160 (Square HD)', value: '2160x2160', aspectRatio: '1:1', imageSize: '2K' },
  { label: '1080x1350 (Social)', value: '1080x1350', aspectRatio: '3:4', imageSize: '2K' },
  { label: '1958x745 (Banner)', value: '1958x745', aspectRatio: '16:9', imageSize: '2K' },
];
