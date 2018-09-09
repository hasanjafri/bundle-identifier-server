var mongoose = require('mongoose');

import BundleIdentifier from '../models/bundleIdentifier';
import { jsonErr, jsonSuccess } from '../utils/json';

const bundleIdentifierHandler = {};

// bundleIdentifierHandler.addId = (req, res) => {
//     const { bundle_id, build_number } = req.body;

//     if (!bundle_id || !build_number) {
//         return jsonErr(res, 'Please enter a bundle_id and a build_number');
//     } else if (build_number < 0) {
//         return jsonErr(res, 'Invalid build_number; the lowest build_number is 0');
//     } else if (bundle_id.length < 7) {
//         return jsonErr(res, 'Invalid bundle_id; bundle_ids must be in the format com.[COMPANY].[APP-NAME]')
//     }

//     bundle_id = bundle_id.replace(/\s+/g, '');

//     BundleIdentifier.findOne({ bundle_id }).then(existingId => {
//         if (existingId) {
//             return jsonErr(res, 'This bundle_id already exists.')
//         }

//         const newBundleId = new BundleIdentifier(req.body);
//         newBundleId.save().then(createdBundleId => {
//             return jsonSuccess(res, createdBundleId);
//         }).catch(err => jsonErr(res, err));
//     });
// }

bundleIdentifierHandler.read = (req, res) => {
    BundleIdentifier.findOne({ bundle_id: req.params.bundle_id }).select('-_id').then(bundle => jsonSuccess(res, bundle));
}

bundleIdentifierHandler.readAll = (req, res) => {
    BundleIdentifier.find({}).select('-_id').sort('-created_at').then(bundles => jsonSuccess(res, bundles)).catch(err => jsonErr(res, err));
}

bundleIdentifierHandler.set = (req, res) => {
    var { bundle_id, build_number } = req.body;

    if (!bundle_id) {
        return jsonErr(res, 'Please enter a bundle_id');
    } else if (build_number < 0) {
        return jsonErr(res, 'Invalid build_number; the lowest build_number is 0');
    } else if (bundle_id.length < 7) {
        return jsonErr(res, 'Invalid bundle_id; bundle_ids must be in the format com.[COMPANY].[APP-NAME]')
    }

    bundle_id = bundle_id.replace(/\s+/g, '');

    BundleIdentifier.findOne({ bundle_id }).then(existingId => {
        if (existingId) {
            var current_build_number = existingId.build_number;
            if (build_number == current_build_number) {
                return jsonSuccess(res, 'Current build number is already '+build_number.toString()).catch(err => jsonErr(res, err));
            } else if (build_number > current_build_number) {
                existingId.build_number = build_number;
                existingId.last_updated = new Date();
                existingId.save().then(updatedId =>
                    jsonSuccess(res, 'Build number for '+updatedId.bundle_id+' was updated to ' + updatedId.build_number.toString())).catch(err => jsonErr(res, err));
            } else {
                return jsonSuccess(res, 'Error! ' + build_number.toString() + ' is an older version than the stored version for this bundle_id: ' + current_build_number.toString()).catch(err => jsonErr(res, err));
            }
        } else {
            const newBundleId = new BundleIdentifier({bundle_id: bundle_id, build_number: 0});
            newBundleId.save().then(createdBundleId => {
                return jsonSuccess(res, createdBundleId.bundle_id + ' was created and initialized with build_number = 0');
            }).catch(err => jsonErr(res, err));
        }
    });
}

bundleIdentifierHandler.bump = (req, res) => {
    var { bundle_id } = req.body;

    if (!bundle_id) {
        return jsonErr(res, 'Please enter a bundle_id');
    } else if (bundle_id.length < 7) {
        return jsonErr(res, 'Invalid bundle_id; bundle_ids must be in the format com.[COMPANY].[APP-NAME]')
    }

    bundle_id = bundle_id.replace(/\s+/g, '');

    BundleIdentifier.findOne({ bundle_id }).then(existingId => {
        if (existingId) {
            existingId.build_number = existingId.build_number + 1;
            existingId.last_updated = new Date();
            existingId.save().then(updatedId => jsonSuccess(res, 'Build number was bumped to: '+ updatedId.build_number.toString())).catch(err => jsonErr(res, err));
        } else {
            const newBundleId = new BundleIdentifier({bundle_id: bundle_id, build_number: 0});
            newBundleId.save().then(createdBundleId => {
                jsonSuccess(res, createdBundleId.bundle_id + ' was created and initialized with build_number = 0');
            }).catch(err => jsonErr(res, err));
        }
    });
}

export default bundleIdentifierHandler;