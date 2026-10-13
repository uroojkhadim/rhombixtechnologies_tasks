require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Blog = require('../models/Blog');

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Tag.deleteMany(),
    Blog.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@blog.com',
    password: 'admin123',
    role: 'admin',
  });

  await User.create({
    name: 'John Reader',
    email: 'user@blog.com',
    password: 'user123',
    role: 'user',
  });

  const categories = await Category.insertMany([
    { name: 'Technology' },
    { name: 'Design' },
    { name: 'Business' },
    { name: 'Lifestyle' },
  ]);

  const tags = await Tag.insertMany([
    { name: 'Angular' },
    { name: 'Node.js' },
    { name: 'MongoDB' },
    { name: 'UI/UX' },
    { name: 'Startup' },
  ]);

  const sampleContent = `
    <h2>Introduction</h2>
    <p>Welcome to our dynamic blogging platform. This article explores modern web development practices, 
    scalable architecture, and building delightful user experiences.</p>
    <h3>Key Takeaways</h3>
    <ul>
      <li>Clean code and modular structure</li>
      <li>Secure authentication with JWT</li>
      <li>Responsive design for all devices</li>
    </ul>
    <p>Whether you are a developer or a reader, we hope you enjoy the content on our platform.</p>
  `;

  const blogs = [
    {
      title: 'Building a Modern Blog with Angular and Node',
      content: sampleContent,
      excerpt: 'Learn how to build a full-stack blogging platform with Angular, Express, and MongoDB.',
      category: categories[0]._id,
      tags: [tags[0]._id, tags[1]._id, tags[2]._id],
      author: admin._id,
      isFeatured: true,
      views: 120,
    },
    {
      title: 'Design Systems for Premium Web Apps',
      content: sampleContent,
      excerpt: 'Explore typography, spacing, and component patterns for professional UIs.',
      category: categories[1]._id,
      tags: [tags[3]._id],
      author: admin._id,
      isFeatured: true,
      views: 85,
    },
    {
      title: 'Growing Your Startup Through Content Marketing',
      content: sampleContent,
      excerpt: 'Content marketing strategies that drive engagement and growth.',
      category: categories[2]._id,
      tags: [tags[4]._id],
      author: admin._id,
      views: 64,
    },
    {
      title: 'Mindful Living in a Digital World',
      content: sampleContent,
      excerpt: 'Balance productivity and wellness in everyday life.',
      category: categories[3]._id,
      tags: [tags[3]._id],
      author: admin._id,
      views: 42,
    },
  ];

  await Blog.insertMany(blogs);

  console.log('Seed completed!');
  console.log('Admin: admin@blog.com / admin123');
  console.log('User:  user@blog.com / user123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
