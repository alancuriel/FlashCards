import React, { useState } from "react"
import { TextField, Button, ThemeProvider } from "@material-ui/core"

import "../css/index.scss"
import Layout from "../components/layout"

import theme from "../theme.js"

const IndexPage = () => {
  const [Sets, setSets] = useState([{ id: 1, name: "test", cardCount: 2 }])
  const [name, setName] = useState("")

  const handleAddSet = () => {
    if(name.trim() === "")
    {
      
      return;
    }

    setSets([...Sets, { name: name, cardCount: 3 }])
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
        {Sets.map(s => {
          return (
            <div className="set">
              <h2 style={{ margin: "1.5rem .5rem auto" }}>{s.name}</h2>
              <h4 style={{ opacity: 0.75 }}>{s.cardCount}/50 cards</h4>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default IndexPage
