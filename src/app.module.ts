import { Module } from '@nestjs/common'
import { UserModule } from './apps/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './apps/auth/auth.module'
import configs from './config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './lifecycle/guard/jwt-auth.guard'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { RolesModule } from './apps/roles/roles.module'
import { RbacGuard } from './lifecycle/guard/rbac.guard'
import { UploadModule } from './apps/upload/upload.module'
import { TasksModule } from './schedule/tasks.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
    imports: [
        ConfigModule.forRoot({
            // 加载 .env 文件中的环境变量
            envFilePath: ['.env'],
            // 是否在控制台中显示加载的环境变量，默认为 false
            isGlobal: true,
            load: [...Object.values(configs)],
        }),
        ThrottlerModule.forRootAsync({
            useFactory: () => ({
                errorMessage: '当前操作过于频繁，请稍后再试！',
                throttlers: [{ ttl: seconds(10), limit: 7 }],
            }),
        }),
        UserModule,
        SharedModule,
        AuthModule,
        RolesModule,
        UploadModule,
        ScheduleModule.forRoot(),
        TasksModule,
    ],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RbacGuard },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule {}
