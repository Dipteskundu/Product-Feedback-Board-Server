import { ValidationError } from './errors.js';

const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        const message = result.error.errors.map((e) => e.message).join(', ');
        throw new ValidationError(message);
      }
      req[source] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
