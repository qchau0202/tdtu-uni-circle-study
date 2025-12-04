const { getSupabaseClient } = require('../../infrastructure/database/supabase');

const getAllCollections = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const { is_public, tag } = req.query;

    let query = supabase
      .from('collections')
      .select(`
        *,
        owner:students(id, student_code, email)
      `);

    // Filter by is_public if provided
    if (is_public !== undefined) {
      query = query.eq('is_public', is_public === 'true');
    }

    // Filter by tag if provided (using array contains)
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    res.status(200).json({
      collections: data
    });
  } catch (error) {
    next(error);
  }
};

const getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        owner:students(id, student_code, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        error: {
          message: 'Collection not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      collection: data
    });
  } catch (error) {
    next(error);
  }
};

const createCollection = async (req, res, next) => {
  try {
    const collectionData = req.body;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('collections')
      .insert([collectionData])
      .select();

    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    res.status(201).json({
      message: 'Collection created successfully',
      collection: data[0]
    });
  } catch (error) {
    next(error);
  }
};

const updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collectionData = req.body;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('collections')
      .update(collectionData)
      .eq('id', id)
      .select();

    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    res.status(200).json({
      message: 'Collection updated successfully',
      collection: data[0]
    });
  } catch (error) {
    next(error);
  }
};

const deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    res.status(200).json({
      message: 'Collection deleted successfully'
    });
  } catch (error) {
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
