import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments'

export const StringMessage = (args: ValidationArguments) => {
    const { property } = args
    return `${property}必须为字符串`
}

export const defaultStringOptions = {
    message: StringMessage,
}
