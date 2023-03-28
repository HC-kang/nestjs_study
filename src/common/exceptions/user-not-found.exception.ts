import { NotFoundException } from "@nestjs/common";
import { Strings } from "../constants";

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super(Strings.USER_NOT_FOUND_EXCEPTION, error);
  }
}