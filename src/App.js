import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState([])
  const [author, setAuthor] = useState([])
  const [url, setUrl] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
    console.log("hello")
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogappUser',JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.clear()
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const blog = await blogService.create({
        title, author, url
      })
      console.log(blog)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
    
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <form onSubmit={handleCreateBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title" 
          onChange={({ target }) => setTitle(target.value)}
          />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author" 
          onChange={({ target }) => setAuthor(target.value)}
          />
      <div>
      </div>
        url:
        <input
          type="text"
          value={url}
          name="Url" 
          onChange={({ target }) => setUrl(target.value)}
          />
      </div>
      <button type="submit">create</button>
    </form>
    )

  if(user === null) {
    return (
      <div>
        <h2> Login to application </h2>
        {loginForm()}
      </div>
      
    )
  }
  else {
    return (
      <div>
        <h2>blogs</h2>
        <div style={{padding:"10px"}}>
          <form onSubmit={handleLogout} 
          style={{display:"inline-flex","align-items":"center"}}>
          <p style={{padding:"10px"}}>{user.name} logged in</p>
          <button type="submit" style={{"max-height":"20px"}}> 
          Logout </button>
          </form>
        </div>
        <div>
        {blogForm()}
        </div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
}

export default App