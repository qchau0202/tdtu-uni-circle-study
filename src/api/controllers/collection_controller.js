const { validateCreateCollection, validateUpdateCollection } = require('../validators/collection_validator');
const collectionService = require('../../domain/services/collection_service');

const getAllCollections = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.substring(7);
    const currentUserId = req.user?.id;
    const { is_public, tag, filter, search } = req.query;

    const filters = {
      is_public,
      tag,
      filter,
      search,
      currentUserId
    };

    const result = await collectionService.getAllCollections(token, filters);

    res.status(200).json({
      success: true,
      count: result.count,
      filter: result.filter,
      collections: result.collections
    });
  } catch (error) {
    if (error.message === 'Authentication required to view your collections') {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: error.message,
          status: 401
        }
      });
    }
    next(error);
  }
};

const getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.substring(7);

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_UUID',
          message: 'Invalid collection ID format',
          status: 400
        }
      });
    }

    const collection = await collectionService.getCollectionById(token, id);

    if (!collection) {
      return res.status(404).json({
        error: {
          code: 'COLLECTION_NOT_FOUND',
          message: 'Collection not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      collection
    });
  } catch (error) {
    next(error);
  }
};

const createCollection = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const token = req.headers.authorization?.substring(7);

    if (!currentUserId) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required to create collection',
          status: 401
        }
      });
    }

    const collectionData = req.body;

    // Validate collection data
    const validationErrors = validateCreateCollection(collectionData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors,
          status: 400
        }
      });
    }

    const collection = await collectionService.createCollection(token, collectionData, currentUserId);

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      collection
    });
  } catch (error) {
    next(error);
  }
};

const updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    const token = req.headers.authorization?.substring(7);

    if (!currentUserId) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required to update collection',
          status: 401
        }
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_UUID',
          message: 'Invalid collection ID format',
          status: 400
        }
      });
    }

    const collectionData = req.body;

    // Validate collection data
    const validationErrors = validateUpdateCollection(collectionData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors,
          status: 400
        }
      });
    }

    const collection = await collectionService.updateCollection(token, id, collectionData, currentUserId);

    if (!collection) {
      return res.status(404).json({
        error: {
          code: 'COLLECTION_NOT_FOUND',
          message: 'Collection not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Collection updated successfully',
      collection
    });
  } catch (error) {
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this collection',
          status: 403
        }
      });
    }
    next(error);
  }
};

const deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    const token = req.headers.authorization?.substring(7);

    if (!currentUserId) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required to delete collection',
          status: 401
        }
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_UUID',
          message: 'Invalid collection ID format',
          status: 400
        }
      });
    }

    const result = await collectionService.deleteCollection(token, id, currentUserId);

    if (!result) {
      return res.status(404).json({
        error: {
          code: 'COLLECTION_NOT_FOUND',
          message: 'Collection not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this collection',
          status: 403
        }
      });
    }
    next(error);
  }
};

module.exports = {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};
