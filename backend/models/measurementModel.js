import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  measurements: [
    {
      timestamp: { type: Date, default: Date.now },  
      ankle: { type: Number, required: true },
      arm_length: { type: Number, required: true },
      belly: { type: Number, required: true },
      chest: { type: Number, required: true },
      height: { type: Number, required: true },
      hips: { type: Number },
      neck: { type: Number },
      shoulder: { type: Number },
      thigh: { type: Number },
      waist: { type: Number },
      wrist: { type: Number },
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




  