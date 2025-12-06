const { createClient } = require('@supabase/supabase-js');
const config = require('../../config');
const Collection = require('../models/collection_model');

class CollectionService {
    constructor() { }

    createSupabaseClient(token) {
        return createClient(
            config.supabase.url,
            config.supabase.anonKey,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );
    }

    async getAllCollections(token, filters = {}) {
        const supabase = this.createSupabaseClient(token);
        const { is_public, tag, filter, search, currentUserId } = filters;

        let query = supabase
            .from('collections')
            .select(`
                *,
                owner:students!collections_owner_id_fkey(id, student_code, email)
            `);

        // Filter by scope (All, My Collections, Public)
        if (filter) {
            if (filter === 'my') {
                if (!currentUserId) {
                    throw new Error('Authentication required to view your collections');
                }
                query = query.eq('owner_id', currentUserId);
            } else if (filter === 'public') {
                query = query.eq('is_public', true);
            }
        }

        // Filter by is_public if provided
        if (is_public !== undefined) {
            query = query.eq('is_public', is_public === 'true');
        }

        // Filter by tag
        if (tag) {
            query = query.contains('tags', [tag]);
        }

        // Search in name and description
        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Order by created_at descending
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
            throw new Error(`Failed to fetch collections: ${error.message}`);
        }

        const collections = data.map(c => Collection.fromDatabase(c));
        return {
            collections,
            count: collections.length,
            filter: filter || 'all'
        };
    }

    async getCollectionById(token, id) {
        const supabase = this.createSupabaseClient(token);

        const { data, error } = await supabase
            .from('collections')
            .select(`
                *,
                owner:students!collections_owner_id_fkey(id, student_code, email)
            `)
            .eq('id', id)
            .maybeSingle();

        if (error) {
            throw new Error(`Failed to fetch collection: ${error.message}`);
        }

        if (!data) {
            return null;
        }

        return Collection.fromDatabase(data);
    }

    async createCollection(token, collectionData, currentUserId) {
        const supabase = this.createSupabaseClient(token);

        const insertData = {
            owner_id: currentUserId,
            name: collectionData.name.trim(),
            description: collectionData.description?.trim() || null,
            is_public: collectionData.is_public !== undefined ? collectionData.is_public : false,
            tags: collectionData.tags || [],
            refs: collectionData.refs || []
        };

        const { data, error } = await supabase
            .from('collections')
            .insert([insertData])
            .select(`
                *,
                owner:students!collections_owner_id_fkey(id, student_code, email)
            `)
            .single();

        if (error) {
            throw new Error(`Failed to create collection: ${error.message}`);
        }

        return Collection.fromDatabase(data);
    }

    async updateCollection(token, id, collectionData, currentUserId) {
        const supabase = this.createSupabaseClient(token);

        // Check if collection exists and user is the owner
        const { data: existingCollection, error: fetchError } = await supabase
            .from('collections')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (fetchError) {
            throw new Error(`Failed to check collection existence: ${fetchError.message}`);
        }

        if (!existingCollection) {
            return null;
        }

        // Check ownership
        if (existingCollection.owner_id !== currentUserId) {
            throw new Error('FORBIDDEN');
        }

        // Prepare update data
        const updateData = {};
        if (collectionData.name !== undefined) updateData.name = collectionData.name.trim();
        if (collectionData.description !== undefined) updateData.description = collectionData.description?.trim() || null;
        if (collectionData.is_public !== undefined) updateData.is_public = collectionData.is_public;
        if (collectionData.tags !== undefined) updateData.tags = collectionData.tags;
        if (collectionData.refs !== undefined) updateData.refs = collectionData.refs;

        const { data, error } = await supabase
            .from('collections')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                owner:students!collections_owner_id_fkey(id, student_code, email)
            `)
            .single();

        if (error) {
            throw new Error(`Failed to update collection: ${error.message}`);
        }

        return Collection.fromDatabase(data);
    }

    async deleteCollection(token, id, currentUserId) {
        const supabase = this.createSupabaseClient(token);

        // Check if collection exists and user is the owner
        const { data: existingCollection, error: fetchError } = await supabase
            .from('collections')
            .select('owner_id')
            .eq('id', id)
            .maybeSingle();

        if (fetchError) {
            throw new Error(`Failed to check collection existence: ${fetchError.message}`);
        }

        if (!existingCollection) {
            return null;
        }

        // Check ownership
        if (existingCollection.owner_id !== currentUserId) {
            throw new Error('FORBIDDEN');
        }

        const { error } = await supabase
            .from('collections')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete collection: ${error.message}`);
        }

        return true;
    }
}

module.exports = new CollectionService();
