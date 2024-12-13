import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments'

export const EnumMessage = (args: ValidationArguments) => {
    const { property, constraints } = args

    return `${property}必须是${constraints[1].join(', ')}其中之一`
}

export const defaultEnumOptions = {
    message: EnumMessage,
}
