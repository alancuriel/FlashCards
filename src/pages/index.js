import React, { useState, useEffect } from "react"
import { TextField, Button, ThemeProvider } from "@material-ui/core"
import {v4 as uuidv4} from 'uuid'
import {Link} from 'gatsby'

import "../css/index.scss"
import Layout from "../components/layout"

import theme from "../theme.js"

const IndexPage = () => {
  const [Sets, setSets] = useState();
  const [name, setName] = useState("");

  useEffect( () => {
     fetch("https://4suqni6s4l.execute-api.us-east-1.amazonaws.com/Prod/MyResource?TableName=FlashCards",{
       headers: {
         "Content-Type":"json/application"
       }
     })
    .then(x => x.json())
    .then(data => setSets(data))
  },[])

  const handleAddSet = () => {
    if(name.trim() === "")
    {

      return;
    }
    var newItem = {
      "setId": {
        "S": uuidv4()
      },
      "setTitle": {
        "S": name
      }
    }

    Sets.Items.push(newItem)

    fetch("https://4suqni6s4l.execute-api.us-east-1.amazonaws.com/Prod/MyResource", {
      method: 'POST',
      headers: {
        "Content-Type":"json/application"
      },
      body: JSON.stringify({TableName:"FlashCards",Item: newItem})
    }).catch(err => {
      console.log(err)
      Sets.Items.pop()
    })

    setName("")
  }

  return (
    <Layout>
      <h1 style={{ fontSize: "4rem" }}>Create A New Set Of Cards</h1>
      <ThemeProvider theme={theme}>
        <TextField
          style={{ width: "18rem", margin: "10px 25px" }}
          id="standard-basic"
          label="Set Name"
          color="primary"
          max
          onChange={i => {
            setName(i.target.value)
          }}
          value={name}
          inputProps={{
            maxLength: 55
          }}
        />
        <Button
          style={{ margin: ".7rem" }}
          variant="outlined"
          color="primary"
          onClick={handleAddSet}
        >
          Add
        </Button>
      </ThemeProvider>
      <div className="cards">
      { Sets &&
        Sets.Items.map(s => {
          return (
            <Link to={"/app/card-set/"+s.setId.S} style={{textDecoration:"none", color: "black", marginTop: "1.5rem"}}>
              <div className="set">
                <h2 style={{ margin: "1.5rem .5rem auto" }}>{s.setTitle.S}</h2>
                <h4 style={{ opacity: 0.75 }}>{s.cards ? s.cards.L.length : 0 }/50 cards</h4>
              </div>
            </Link>
          )
        })}
        
      </div>
    </Layout>
  )
}

export default IndexPage
