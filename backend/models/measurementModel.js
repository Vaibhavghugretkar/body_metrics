import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  measurements: [
    {
      timestamp: { type: Date, default: Date.now },  // Capture date for each measurement
      chest: { type: Number, required: true },
      waist: { type: Number, required: true },
      hips: { type: Number, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
      neck: { type: Number },
      thighs: { type: Number },
      arms: { type: Number },
      bmi: { type: Number },
      bodyType: { type: String, enum: ['Ectomorph', 'Mesomorph', 'Endomorph'] },
      units: {
        length: { type: String, enum: ['cm', 'inches'], default: 'cm' },
        weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' }
      },
      images: [String]  // URLs of measurement images
    }
  ],
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Measurement', measurementSchema);
