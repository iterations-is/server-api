/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const DocumentsSchema = new Schema({
   interpreter: String,
   store: Object,
});

const DocumentsModel = mongoose.model('Part', DocumentsSchema);

export default DocumentsModel;
