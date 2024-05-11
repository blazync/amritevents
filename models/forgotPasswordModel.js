const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    uuid: {
        type: 'UUID',
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    expires_by: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
