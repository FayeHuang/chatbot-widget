import React, { useEffect, useState } from 'react'
import Fab from '@material-ui/core/Fab'
import ChatIcon from '@material-ui/icons/Chat'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import { CardHeader, Divider } from '@material-ui/core'

function App({ appId }) {
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [canTyping, setCanTyping] = useState(true)
 
  useEffect(() => {
    const url = `https://embed-chatbot.vercel.app/api/whitelist?appId=${appId}`
    fetch(url)
    .then(res => res.json())
    .catch(error => { 
      console.error('Error:', error)
      setLoading(false)
    })
    .then(response => {
      console.log('Success:', response)
      setIsValid(response.isValid)
      setLoading(false)
    });
  }, [])

  const handleBtnClick = () => {
    setShowDialog(!showDialog)
  }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      setCanTyping(false)
      setUserInput("")
      // setMessages([...messages, {user: e.target.value, bot:"..."}])
      const url = `https://embed-chatbot.vercel.app/api/talk?appId=${appId}&userInput=${e.target.value}`
      fetch(url)
      .then(res => res.json())
      .catch(error => { 
        console.error('Error:', error)
      })
      .then(response => {
        console.log('Success:', response)
        setCanTyping(true)
        if (messages.length === 0)
          setMessages([{ user: response.text, bot: response.response }])
        else
          setMessages([...messages, { user: response.text, bot: response.response }])
      });
    }
  }

  const handleChange = (e) => {
    setUserInput(e.target.value)
  }

  if (!appId) return <React.Fragment />
  return (
    <div>
      <Card 
        variant="outlined" 
        style={{position:'fixed', bottom:120, right:48, width:240, height:300, backgroundColor:'antiquewhite', display: showDialog ? 'flex':'none', flexDirection:'column'}} 
      >
        <CardHeader title="HIBOT" style={{backgroundColor:'#e0bfbf'}}/>
        <CardContent style={{flexGrow:1, overflowY:'scroll'}}>
          {messages.map((m,index) =>
            <div key={index}>
              <Typography variant="body1">me: {m.user}</Typography>
              <Typography variant="body1">bot: {m.bot}</Typography>
            </div>
          )}
        </CardContent>
        <CardActions>
          <TextField disabled={!canTyping} hiddenLabel variant="outlined" placeholder="say something ..." onKeyDown={handleKeyPress} onChange={handleChange} value={userInput} />
        </CardActions>
      </Card>
      <Fab color="primary" aria-label="add" style={{position:'fixed', bottom:40, right:48}} disabled={!isValid || loading} onClick={handleBtnClick}>
        {loading ? <CircularProgress /> : <ChatIcon /> }
      </Fab>
    </div>
  );
}

export default App;
