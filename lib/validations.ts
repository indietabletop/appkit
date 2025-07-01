export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validEmail = (value: string) => {
  if (value && !EMAIL_REGEX.test(value)) {
    return "This doesn't look like a valid email.";
  }

  return null;
};

export const validPassword = (value: string) => {
  if (value) {
    if (value.length < 8) {
      return "A password has to be at least 8 characters long.";
    }

    if (value.length > 256) {
      return "A password cannot be longer than 256 characters.";
    }

    return null;
  }

  return null;
};
