const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Busy'], default: 'Available' },
    currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
});

module.exports = mongoose.model('Table', tableSchema);
