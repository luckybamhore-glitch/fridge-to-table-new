// import mongoose from 'mongoose';

// const ingredientSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     have: { type: Boolean, default: false },
//   },
//   { _id: false }
// );

// const recipeSchema = new mongoose.Schema(
//   {
//     recipeId: { type: String, required: true, unique: true, index: true },
//     title: { type: String, required: true },
//     subtitle: { type: String },
//     coverImageUrl: { type: String, required: true },
//     matchPercent: { type: Number, default: 85 },
//     timeMinutes: { type: Number, required: true },
//     servings: { type: Number, required: true },
//     difficulty: { type: String, default: 'Easy' },
//     diet: [{ type: String }],
//     ingredients: [ingredientSchema],
//     steps: [{ type: String, required: true }],
//     youtubeUrl: { type: String },
//     tips: { type: String },
//   },
//   { timestamps: true }
// );

// // Transform _id to id in JSON output
// recipeSchema.set('toJSON', {
//   transform: (doc, ret) => {
//     ret.id = ret.recipeId || ret._id.toString();
//     delete ret._id;
//     delete ret.__v;
//     delete ret.recipeId;
//     return ret;
//   },
// });

// export const Recipe = mongoose.model('Recipe', recipeSchema);
// export default Recipe;



import mongoose from 'mongoose';

const recipeIngredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    have: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    recipeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    coverImageUrl: {
      type: String,
      trim: true,
    },

    matchPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    timeMinutes: {
      type: Number,
      min: 0,
      default: 30,
    },

    servings: {
      type: Number,
      min: 1,
      default: 2,
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },

    diet: {
      type: [String],
      default: [],
    },

    ingredients: {
      type: [recipeIngredientSchema],
      default: [],
    },

    steps: {
      type: [String],
      default: [],
    },

    youtubeUrl: {
      type: String,
      trim: true,
    },

    tips: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ['database', 'gemini', 'user'],
      default: 'database',
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model('Recipe', recipeSchema);