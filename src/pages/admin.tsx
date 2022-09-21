import { navigate } from 'gatsby'
import React from 'react'
import { ServiceContext } from '../../gatsby-browser'
import Footer from '../components/footer'
import Header from '../components/header'
import { ISelectUser } from '../models/user'
import questionSvg from '../images/question-circle-solid.svg'
import ProfilePicture, { ProfilePicSize } from '../components/profilePicture'

const Admin = () => {
  const { authService, adminService } = React.useContext(ServiceContext)
  if (!authService.loggedInUser || !authService.isAdmin) {
    typeof window != 'undefined' && navigate('/')
    return null
  }
  const [loading, setLoading] = React.useState<boolean>(false)
  const [userList, setUserList] = React.useState<ISelectUser[]>([])
  React.useEffect(() => {
    loadUsers()
  }, [])

  const handleUserSelect = (id: string) => {
    const next = userList.map(u => {
      if (u.spotifyId == id) {
        u.selected = !u.selected
      }
      return u
    })
    setUserList(next)
  }

  async function loadUsers() {
    if (!authService.isAdmin || !authService.loggedInUser) {
      return
     }
    setLoading(true)
    try {
      const r = await adminService.loadUsers(authService.loggedInUser.spotifyId)
      const loaded: ISelectUser[] = r.map(u => ({
        ...u,
        selected: false,
      }))
      setUserList(loaded)
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
      const selectedIds: string[] = userList
        .filter(u => u.selected)
        .map(u => u.spotifyId)
      await adminService.generateQuiz(selectedIds)
     } catch (e) {
      console.error(e)
      console.error('adminGenerateQuiz failed')
    }
    setLoading(false)
  }
  function toggleAll(nextState: boolean) {
    const nextList = userList.map(u => ({
      ...u,
      selected: nextState
    }))
    setUserList(nextList)
  }

  let imgClass = 'profileImg imgFull'
  if (loading) imgClass += ' imageRotate'
  const toggleState = !!userList.find(u => !u.selected)
  return (
    <>
      <Header />
      <main className="container">
        <section style={{textAlign: 'center'}}>
          <img className={imgClass} style={{margin: '0 auto'}}
            src={questionSvg} alt="question mark icon"
            />
          <h1>Admin</h1>
          <button onClick={() => toggleAll(toggleState)} className="toggle-users">
            {toggleState ? 'select' : 'unselect'} all
          </button>
        </section>
        <section className="users-table">
          {loading && <p>Loading users...</p>}
          {!loading && userList.map((u, idx) => {
            return (
              <div key={idx} className="user-row">
                <ProfilePicture src={u.displayPicture} size={ProfilePicSize.thumbnail}
                  vCenter={true} name={u.displayName} />
                <span className="user-name">{u.displayName}</span>
                <input className="select-user" type="checkbox" name="select-user" checked={u.selected} 
                  onChange={() => handleUserSelect(u.spotifyId)}/>
              </div>
            )
          })}
        </section>
        <section>
          <button className="generate-quiz" onClick={generateQuiz}>
            I makea da quiz ohhh!!
          </button>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Admin