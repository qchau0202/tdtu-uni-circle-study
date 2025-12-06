const validateCreateCollection = (data) => {
    const errors = [];

    // Required fields
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('name is required and must be a non-empty string');
    } else if (data.name.length > 255) {
        errors.push('name must not exceed 255 characters');
    }

    // Optional description validation
    if (data.description !== undefined && data.description !== null) {
        if (typeof data.description !== 'string') {
            errors.push('description must be a string');
        }
    }

    // Validate is_public (optional, defaults to false)
    if (data.is_public !== undefined && typeof data.is_public !== 'boolean') {
        errors.push('is_public must be a boolean');
    }

    // Validate tags array
    if (data.tags !== undefined) {
        if (!Array.isArray(data.tags)) {
            errors.push('tags must be an array');
        } else {
            data.tags.forEach((tag, idx) => {
                if (typeof tag !== 'string') {
                    errors.push(`tags[${idx}] must be a string`);
                } else if (tag.trim().length === 0) {
                    errors.push(`tags[${idx}] cannot be empty`);
                }
            });
        }
    }

    // Validate refs array (references to resources or other items)
    if (data.refs !== undefined) {
        if (!Array.isArray(data.refs)) {
            errors.push('refs must be an array');
        } else {
            data.refs.forEach((ref, idx) => {
                if (typeof ref !== 'string') {
                    errors.push(`refs[${idx}] must be a string`);
                } else if (ref.trim().length === 0) {
                    errors.push(`refs[${idx}] cannot be empty`);
                }
            });
        }
    }

    return errors;
};

const validateUpdateCollection = (data) => {
    const errors = [];

    // All fields are optional for update, but if provided must be valid
    if (data.name !== undefined) {
        if (typeof data.name !== 'string' || data.name.trim().length === 0) {
            errors.push('name must be a non-empty string');
        } else if (data.name.length > 255) {
            errors.push('name must not exceed 255 characters');
        }
    }

    if (data.description !== undefined && data.description !== null) {
        if (typeof data.description !== 'string') {
            errors.push('description must be a string');
        }
    }

    if (data.is_public !== undefined && typeof data.is_public !== 'boolean') {
        errors.push('is_public must be a boolean');
    }

    if (data.tags !== undefined) {
        if (!Array.isArray(data.tags)) {
            errors.push('tags must be an array');
        } else {
            data.tags.forEach((tag, idx) => {
                if (typeof tag !== 'string') {
                    errors.push(`tags[${idx}] must be a string`);
                } else if (tag.trim().length === 0) {
                    errors.push(`tags[${idx}] cannot be empty`);
                }
            });
        }
    }

    if (data.refs !== undefined) {
        if (!Array.isArray(data.refs)) {
            errors.push('refs must be an array');
        } else {
            data.refs.forEach((ref, idx) => {
                if (typeof ref !== 'string') {
                    errors.push(`refs[${idx}] must be a string`);
                } else if (ref.trim().length === 0) {
                    errors.push(`refs[${idx}] cannot be empty`);
                }
            });
        }
    }

    return errors;
};

module.exports = {
    validateCreateCollection,
    validateUpdateCollection
};
