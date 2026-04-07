import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

/**
 * Runs after express-validator checks.
 * If there are errors, returns a 422 with the first error message.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((e) => e.msg);
    return sendError(res, errorMessages[0], 422, errorMessages);
  }
  next();
};

export default validate;




