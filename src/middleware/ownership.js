import { NotFoundError, ForbiddenError } from './errors.js';

const ownership = (fetchResource) => {
  return async (req, res, next) => {
    try {
      const resource = await fetchResource(req.params.id);
      if (!resource) {
        throw new NotFoundError();
      }

      if (resource.createdByActorId.toString() !== req.actorId.toString()) {
        throw new ForbiddenError();
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default ownership;
