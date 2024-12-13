export enum ErrorEnum {
    SERVER_ERROR = '500:服务繁忙，请稍后再试',

    INVALID_VERIFICATION_CODE = '1001:验证码填写有误',
    INVALID_USERNAME_PASSWORD = '1002:用户名密码有误',
    ACCESS_TOKEN_EXPIRED = '1003:token已过期',
    REFRESH_TOKEN_EXPIRED = '1004:token已过期',

    SYSTEM_USER_EXISTS = '2001:系统用户已存在',
    INVALID_PASSWORD = '2002:密码有误',
    USER_NOT_FOUND = '2003: 用户不存在',

    ROLE_EXIST = '3001:角色名称已存在',
    ROLE_NOT_EXIST = '3001:角色不存在',

    UPLOAD_FILE_FAIL = '4001:文件上传失败',
    MERGE_FILE_FAIL = '4002:文件合并失败',
}

export const SUCCESS_CODE = 0
