
export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
}

export interface ImageSizeOption {
  label: string;
  value: string;
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:3' | '3:4';
  imageSize?: '1K' | '2K' | '4K';
}
