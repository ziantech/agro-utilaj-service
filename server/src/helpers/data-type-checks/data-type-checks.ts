export const isValidEmail = (value: any): boolean => {

    if(typeof value !== 'string') {
        return false;
    }

    if(value.trim() === '') {
        return false;
    }

    const sqlInjectionPattern = /('|--|;|\/\*|\*\/|xp_)/i;
    if(sqlInjectionPattern.test(value)) {
        return false;
    }

    const xssPattern = /<script|<\/script>|<[^>]+>/i;
    if (xssPattern.test(value)) {
      return false;
    }

    if (decodeURIComponent(value) !== value) {
        return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value);
}
export const isValidPassword = (value: any): boolean => {
    if (typeof value !== 'string' || value.trim() === '') {
      return false;
    }
  
    if (value.length < 6) {
      return false;
    }
  
    const hasNumber = /\d/;
    if (!hasNumber.test(value)) {
      return false;
    }
  
    return true;
};