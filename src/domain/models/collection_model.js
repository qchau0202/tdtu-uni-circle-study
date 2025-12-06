class Collection {
    constructor(data) {
        this.id = data.id;
        this.owner_id = data.owner_id;
        this.name = data.name;
        this.description = data.description;
        this.is_public = data.is_public || false;
        this.tags = data.tags || [];
        this.refs = data.refs || [];
        this.created_at = data.created_at;
        this.owner = data.owner;
    }

    static fromDatabase(data) {
        return new Collection(data);
    }

    toJSON() {
        return {
            id: this.id,
            owner_id: this.owner_id,
            name: this.name,
            description: this.description,
            is_public: this.is_public,
            tags: this.tags,
            refs: this.refs,
            created_at: this.created_at,
            owner: this.owner
        };
    }
}

module.exports = Collection;
