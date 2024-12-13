import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments'

export const LengthMessage = (args: ValidationArguments) => {
    const {
        value,
        property,
        constraints: [min, max],
    } = args
    if (!value) {
        return `${property}不能为空`
    }
    return `${property}长度在${min}和${max}之间`
}

export const defaultLengthOptions = {
    message: LengthMessage,
}
