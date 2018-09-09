import mongoose from 'mongoose';

const { Schema } = mongoose;

class BundleIdentifier extends Schema {
    constructor() {
        const bundleIdentifier = super({
            bundle_id: {
                type: String,
                unique: true,
                required: true,
                trim: true,
                minlength: [7, 'Bundle Identifier must be 7 characters or more in the format: com.x.x']
            },
            build_number: {
                type: Number,
                default: 0,
                min: 0
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            last_updated: {
                type: Date,
                default: Date.now
            }
        });
        return bundleIdentifier;
    }
}

export default mongoose.model('BundleIdentifier', new BundleIdentifier);