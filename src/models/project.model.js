import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  type: {
    type: String,
    enum: ['videoCompression', 'videoCaption', 'generatePost', 'imageResize'],
    required: true,
  },
  ownerClerkUserId: { type: String, required: true },
  previewUrl: { type: String, required: true },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
