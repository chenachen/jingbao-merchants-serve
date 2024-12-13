import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments'

export const IntMessage = (args: ValidationArguments) => {
    const { property } = args
    return `${property}必须为整数`
}

export const defaultIntOptions = {
    message: IntMessage,
}
