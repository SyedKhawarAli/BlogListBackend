const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Test blog',
    author: 'Test author',
    url: 'http://test.com',
    likes: 0
  },
  {
    title: 'Test blog 2',
    author: 'Test author 2',
    url: 'http://test2.com',
    likes: 5
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Test author', url: 'http://test.com', likes: 0 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}