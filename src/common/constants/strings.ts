export enum Strings {
  /**
   * Common
   */
  'INVALID_REQUEST' = '잘못된 요청입니다.',
  'UNAUTHORIZED_EXCEPTION' = '권한이 없습니다.',

  /**
   * User
   */
  'USER_ALREADY_EXISTS' = '해당 이메일로는 가입할 수 없습니다.',
  'USER_NOT_FOUND_EXCEPTION' = '사용자를 찾을 수 없습니다.',
  'PASSWORD_NOT_MATCH_EXCEPTION' = '비밀번호가 일치하지 않습니다.',
  'USER_SAVE_FAILED' = '사용자 정보 저장에 실패했습니다.',

  /**
   * Email
   * */
  'EMAIL_SEND_FAILED' = '이메일 전송에 실패했습니다.',

  /**
   * UploadedFile
   */
  'UNPROCESSABLE_FILE_EXCEPTION' = '파일을 처리할 수 없습니다.',
  'UPLOADED_FILE_NOT_FOUND_EXCEPTION' = '업로드된 파일을 찾을 수 없습니다.',
  'TOO_LARGE_FILE_EXCEPTION' = '파일이 너무 큽니다.',
  'INVALID_FILE_EXTENSION' = '파일 확장자가 올바르지 않습니다.',
}
