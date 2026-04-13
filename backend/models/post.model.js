import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    image: {
      type: String,
      default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: { type: String, default: 'uncategorized' },
    slug: { type: String, required: true, unique: true },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    reactions: {
      fire: { type: [String], default: [] },
      bulb: { type: [String], default: [] },
      clap: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
