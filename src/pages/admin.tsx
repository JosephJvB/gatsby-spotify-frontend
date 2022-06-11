import { navigate } from 'gatsby'
import React from 'react'
import { ServiceContext } from '../../gatsby-browser'
import Footer from '../components/footer'
import Header from '../components/header'
import { ISelectUser, IUser } from '../models/user'

type IUserMap = {
  [key: string]: ISelectUser
}


const Admin = () => {
  const { authService, adminService } = React.useContext(ServiceContext)
  if (!authService.loggedInUser || !authService.isAdmin) {
    typeof window != 'undefined' && navigate('/')
    return null
  }
  const [loading, setLoading] = React.useState<boolean>(false)
  const [userMap, setUserMap] = React.useState<IUserMap>({})
  React.useEffect(() => {
    loadUsers()
  }, [])

  const handleUserSelect = (id: string) => {
    if (!userMap[id]) {
      return
    }
    userMap[id].selected = !userMap[id].selected
    setUserMap(userMap)
  }

  async function loadUsers() {
    if (!authService.isAdmin || !authService.loggedInUser) {
      return
     }
    setLoading(true)
    try {
      const r = await adminService.loadUsers(authService.loggedInUser.spotifyId)
      const map: IUserMap = {}
      for (const u of r) {
        map[u.spotifyId] = {
          ...u,
          selected: true,
        }
      }
      setUserMap(map)
    } catch (e) {
      console.error(e)
      console.error('failed to load users')
    }
    setLoading(false)
  }
  async function generateQuiz() {
    if (!authService.isAdmin || !authService.loggedInUser) {
     return
    }
    setLoading(true)
    try {
      await adminService.generateQuiz(authService.loggedInUser.spotifyId)
     } catch (e) {
      console.error(e)
      console.error('adminGenerateQuiz failed')
    }
    setLoading(false)
  }

  let imgClass = 'profileImg imgFull'
  if (loading) imgClass += ' imageRotate'
  return (
    <>
      <Header />
      <main>
        <section>
          <img className={imgClass} style={{margin: '0 auto'}}
            src="/static/question-circle-solid.svg" alt="question mark icon"
            />
        </section>
        <section className="users-table">
          {loading && <p>Loading users...</p>}
          {!loading && Object.keys(userMap).map(id => {
            const u = userMap[id]
            return (
              <div className="user-row" onClick={() => handleUserSelect(id)}>
                <span className="user-name">{u.displayName}</span>
                <input type="checkbox" name="select-user" id={u.spotifyId} checked={u.selected} />
              </div>
            )
          })}
        </section>
        <section>
          <button onClick={generateQuiz}>
            I makea da quiz ohhh!!
          </button>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Admin