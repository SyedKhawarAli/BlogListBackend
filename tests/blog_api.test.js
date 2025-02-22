const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const helper = require('./test_helper')
const { title } = require('process')
const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  assert(response.body[0].id)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'http://test.com',
    likes: 0
  }

  const blogsBefore = await helper.blogsInDb()
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert(blogsAtEnd.length === blogsBefore.length + 1)

})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'http://test.com'
  }

  const response = await api.post('/api/blogs').send(newBlog)
  assert(response.body.likes === 0)
})

test('if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
  const newBlog = {
    author: 'Test author',
    likes: 0
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert(blogsAtEnd.length === blogsAtStart.length - 1)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const updatedBlog = {
    title: 'Updated blog',
    author: 'Updated author',
    url: 'http://updated.com',
    likes: 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
  
  assert(updatedBlogAtEnd.title === updatedBlog.title)
  assert(updatedBlogAtEnd.author === updatedBlog.author)
  assert(updatedBlogAtEnd.url === updatedBlog.url)
  assert(updatedBlogAtEnd.likes === updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})