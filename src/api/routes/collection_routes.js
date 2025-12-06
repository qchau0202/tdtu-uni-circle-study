const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection_controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               description: Error code identifier
 *               example: "VALIDATION_ERROR"
 *             message:
 *               type: string
 *               description: Human-readable error message
 *               example: "Validation failed"
 *             details:
 *               oneOf:
 *                 - type: string
 *                 - type: array
 *                   items:
 *                     type: string
 *               description: Additional error details
 *             status:
 *               type: integer
 *               description: HTTP status code
 *               example: 400
 *     
 *     Collection:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the collection
 *         owner_id:
 *           type: string
 *           format: uuid
 *           description: ID of the student who owns the collection
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Name of the collection
 *           example: "My Study Materials"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Description of the collection
 *           example: "Collection of important study resources for final exams"
 *         is_public:
 *           type: boolean
 *           default: false
 *           description: Whether the collection is public or private
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the collection
 *           example: ["computer-science", "algorithms", "final-exam"]
 *         refs:
 *           type: array
 *           items:
 *             type: string
 *           description: References to resources or other items in the collection
 *           example: ["resource-uuid-1", "resource-uuid-2"]
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the collection was created
 *         owner:
 *           type: object
 *           description: Owner information
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             student_code:
 *               type: string
 *               example: "520H0001"
 *             email:
 *               type: string
 *               format: email
 *               example: "520H0001@student.tdtu.edu.vn"
 * 
 *     CreateCollectionRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Name of the collection
 *           example: "My Study Materials"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Description of the collection
 *           example: "Collection of important study resources"
 *         is_public:
 *           type: boolean
 *           default: false
 *           description: Whether the collection is public
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for categorization
 *           example: ["computer-science", "algorithms"]
 *         refs:
 *           type: array
 *           items:
 *             type: string
 *           description: References to resources
 *           example: ["resource-uuid-1"]
 * 
 *     UpdateCollectionRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Updated name
 *         description:
 *           type: string
 *           nullable: true
 *           description: Updated description
 *         is_public:
 *           type: boolean
 *           description: Updated visibility
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Updated tags
 *         refs:
 *           type: array
 *           items:
 *             type: string
 *           description: Updated references
 */

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Collection management API for organizing and managing resource collections
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all collections
 *     description: Retrieve a list of collections with optional filtering by visibility, tags, scope, and search
 *     tags: [Collections]
 *     parameters:
 *       - in: query
 *         name: is_public
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by public/private status
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by specific tag
 *         example: "computer-science"
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [all, my, public]
 *         description: Filter scope (all collections, only my collections, or only public collections)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in collection name and description
 *         example: "algorithms"
 *     responses:
 *       200:
 *         description: Successfully retrieved collections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Number of collections returned
 *                   example: 5
 *                 filter:
 *                   type: string
 *                   description: Applied filter
 *                   example: "all"
 *                 collections:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Collection'
 *       401:
 *         description: Authentication required for filtering by 'my'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', collectionController.getAllCollections);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get collection by ID
 *     description: Retrieve detailed information about a specific collection
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Collection UUID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Successfully retrieved collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 collection:
 *                   $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "INVALID_UUID"
 *                 message: "Invalid collection ID format"
 *                 status: 400
 *       404:
 *         description: Collection not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "COLLECTION_NOT_FOUND"
 *                 message: "Collection not found"
 *                 status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', collectionController.getCollectionById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new collection
 *     description: Create a new collection (requires authentication)
 *     tags: [Collections]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCollectionRequest'
 *           examples:
 *             basic:
 *               summary: Basic collection
 *               value:
 *                 name: "Data Structures Study Guide"
 *                 description: "Important resources for DS course"
 *                 is_public: false
 *                 tags: ["data-structures", "computer-science"]
 *                 refs: []
 *             withRefs:
 *               summary: Collection with references
 *               value:
 *                 name: "Algorithm Resources"
 *                 description: "Comprehensive algorithm materials"
 *                 is_public: true
 *                 tags: ["algorithms", "coding"]
 *                 refs: ["resource-uuid-1", "resource-uuid-2"]
 *     responses:
 *       201:
 *         description: Collection successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Collection created successfully"
 *                 collection:
 *                   $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Validation failed"
 *                 details: ["name is required and must be a non-empty string"]
 *                 status: 400
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "AUTHENTICATION_REQUIRED"
 *                 message: "Authentication required to create collection"
 *                 status: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', collectionController.createCollection);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a collection
 *     description: Update an existing collection (requires authentication and ownership)
 *     tags: [Collections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Collection UUID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCollectionRequest'
 *           examples:
 *             updateCollection:
 *               summary: Update collection fields
 *               value:
 *                 name: "Data Structures Study Guide"
 *                 description: "Important resources for DS course"
 *                 is_public: false
 *                 tags: ["data-structures", "computer-science"]
 *                 refs: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"]
 *     responses:
 *       200:
 *         description: Collection successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Collection updated successfully"
 *                 collection:
 *                   $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Validation error or invalid UUID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "AUTHENTICATION_REQUIRED"
 *                 message: "Authentication required to update collection"
 *                 status: 401
 *       403:
 *         description: Forbidden - not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "You do not have permission to update this collection"
 *                 status: 403
 *       404:
 *         description: Collection not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "COLLECTION_NOT_FOUND"
 *                 message: "Collection not found"
 *                 status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', collectionController.updateCollection);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a collection
 *     description: Delete an existing collection (requires authentication and ownership)
 *     tags: [Collections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Collection UUID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Collection successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Collection deleted successfully"
 *       400:
 *         description: Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "INVALID_UUID"
 *                 message: "Invalid collection ID format"
 *                 status: 400
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "AUTHENTICATION_REQUIRED"
 *                 message: "Authentication required to delete collection"
 *                 status: 401
 *       403:
 *         description: Forbidden - not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "FORBIDDEN"
 *                 message: "You do not have permission to delete this collection"
 *                 status: 403
 *       404:
 *         description: Collection not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "COLLECTION_NOT_FOUND"
 *                 message: "Collection not found"
 *                 status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;
