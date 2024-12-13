import { Module, OnModuleInit } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config';
import { IUploadConfig, UPLOAD_CONFIG_TOKEN } from 'src/config/upload.config';
import { existsSync, mkdirSync } from 'fs';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule implements OnModuleInit {

    constructor (private readonly configService: ConfigService<AllConfigType>) {}

    onModuleInit() {
        const {dir} = this.configService.get<IUploadConfig>(UPLOAD_CONFIG_TOKEN)

        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }
    }

}
