const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async(request, response) => {
  const blog = new Blog(request.body)
  const { title, url } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter