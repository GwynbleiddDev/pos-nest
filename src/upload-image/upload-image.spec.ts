import { Test, TestingModule } from '@nestjs/testing';
import { UploadImage } from './upload-image';

describe('UploadImage', () => {
  let provider: UploadImage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadImage],
    }).compile();

    provider = module.get<UploadImage>(UploadImage);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
