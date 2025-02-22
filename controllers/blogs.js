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

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (deletedBlog) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (exception) {
    next(exception);
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const updatedBlog = request.body;
  try {
    const blog = await Blog.findByIdAndUpdate
      (id,
        {
          title: updatedBlog.title,
          author: updatedBlog.author,
          url: updatedBlog.url,
          likes: updatedBlog.likes
        },
        { new: true });
    if (blog) {
      response.json(blog);
    }
    else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (exception) {
    next(exception);
  }
})

module.exports = blogsRouter