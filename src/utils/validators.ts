import strings from '@i18n/strings';

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//Email validation
export const EmailValidation = (email: string) => {
  if (email === null || email === undefined || email === '') {
    return true;
  }
  const isValidate = emailRegex.test(email);
  return isValidate ? true : strings.validEmail;
};

//Mobile number validation
const MobileValidation = (mobile: any) => {
  if (mobile === null || mobile === undefined || mobile === '') {
    return true;
  }
  // const reg = /^[0-9]{10}$/;
  const reg =
    /^(\+\d{1,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
  const isValidate = reg.test(mobile);
  return isValidate ? true : 'Please enter only 10 digit';
};
const Number = (mobile: any) => {
  if (mobile) {
    if (isNaN(mobile)) {
      return 'Enter Number';
    }
    return true;
  }
  return true;
};
const PercentageValidation = (partnershipPercentage: string) => {
  if (
    partnershipPercentage === null ||
    partnershipPercentage === undefined ||
    partnershipPercentage === ''
  ) {
    return true;
  }
  const reg = /^(?:100(?:\.0{1,10})?|\d{1,2}(?:\.\d{1,10})?)$/;
  const isValidate = reg.test(partnershipPercentage);
  return isValidate ? true : 'Enter value between min 1 to max 100';
};

export { MobileValidation, Number, PercentageValidation };
