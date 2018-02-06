import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  constructor() { }
  static tokenDelimeter = ",";
  static isHeaderPresentFlag = true;
  static validateHeaderAndRecordLengthFlag = true;
  static valildateFileExtenstionFlag = true;
}
