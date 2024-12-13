import { Injectable } from '@nestjs/common'
import { Cron, Interval, Timeout } from '@nestjs/schedule'
import { LoggerService } from '../shared/logger/logger.service'

@Injectable()
export class TasksService {
    constructor(private readonly loggerService: LoggerService) {}

    @Cron('45 * * * * *')
    handleCron() {
        this.loggerService.debug('Called when the second is 45', TasksService.name)
    }

    @Interval(100000000)
    handleInterval() {
        this.loggerService.debug('Called every 100000 seconds', TasksService.name)
    }

    @Timeout(5000)
    handleTimeout() {
        this.loggerService.debug('Called once after 5 seconds', TasksService.name)
    }
}
