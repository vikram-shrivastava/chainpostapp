import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  type: {
    type: String,
    enum: ['videoCompression', 'videoCaption', 'generatePost', 'imageResize'],
    required: true,
  },
  ownerClerkUserId: { type: String, required: true },

  // File details
  compressedUrl: { type: String },
  fileName: { type: String ,default:'Untitled'},
  fileSizeMB: { type: Number },
  compressedSizeMB: { type: Number },
  duration: { type: Number },
  format: { type: String },

  // Caption / Post text
  generatedCaptions: { type: String },
  generatedPostText: { type: Object },

  // Metadata for UI
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued', // when added to queue later
  },
  processingTime: { type: Number }, // in seconds
  progress: { type: Number, default: 0 }, // 0 to 100%

  // Queue tracking
  jobId: { type: String }, // BullMQ job ID
  queueName: { type: String }, // which queue handled it
  errorMessage: { type: String }, // in case of failed job

  // For easy user tracking
  projectTitle: { type: String },
  thumbnailUrl: { type: String },

  // Cloudinary IDs or reference
  publicId: { type: String },

  // Audit / analytics
  userIP: { type: String },
  browser: { type: String },
}, { timestamps: true });


const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
