import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import { Input, InputBase } from "@material-ui/core"

const CardSet = ({ id }) => {
  const [cards, setCards] = useState()
  const [timeout, settimeout] = useState(0)

  useEffect(() => {
    fetch(
      "https://4suqni6s4l.execute-api.us-east-1.amazonaws.com/Prod/MyResource?TableName=FlashCards&id=" +
        id,
      {
        headers: {
          "Content-Type": "json/application",
        },
      }
    )
      .then(x => x.json())
      .then(x => setCards(x))
  }, [id])

  const sendCardUpdate = () => {
    fetch(
      "https://4suqni6s4l.execute-api.us-east-1.amazonaws.com/Prod/MyResource",
      {
        method: "PUT",
        headers: {
          "Content-Type": "json/application",
        },
        body: JSON.stringify({
          TableName: "FlashCards",
          Key: {
            setId: cards.Item.setId,
          },
          UpdateExpression: "Set cards = :c",
          ExpressionAttributeValues: {
            ":c": cards.Item.cards,
          },
        }),
      }
    )
  }

  const updateCard = () => {
    if (timeout) clearTimeout(timeout)

    settimeout(
      setTimeout(() => {
        sendCardUpdate()
      }, 500)
    )
  }

  const updateCardTitle = (index, event) => {
    var newCards = cards
    newCards.Item.cards.L[index].M.title.S = event.target.value
    setCards(newCards)
  }

  const updateCardDesc = (index, event) => {
    var newCards = cards
    newCards.Item.cards.L[index].M.desc.S = event.target.value
    setCards(newCards)
  }

  if (cards) {
    return (
      <Layout>
        <h1 style={{ fontSize: "4rem", marginBottom: ".5rem" }}>
          {cards.Item.setTitle.S}
        </h1>
        <h1 style={{ marginTop: "0", opacity: 0.9 }}>
          {cards.Item.cards !== undefined ? cards.Item.cards.L.length : 0}/50
          cards
        </h1>
        <div className="flash-cards">
          {cards.Item.cards &&
            cards.Item.cards.L.map((c, i) => {
              return (
                <div className="card">
                  <Input
                    defaultValue={c.M.title.S}
                    color="primary"
                    style={{
                      margin: "1.2rem 1.2rem auto",
                      width: "80%",
                      fontWeight: 600,
                    }}
                    inputProps={{ maxLength: 35 }}
                    onChange={e => {
                      updateCardTitle(i, e)
                      updateCard()
                    }}
                  />
                  <InputBase
                    style={{ margin: ".5rem 1.2rem", width: "80%" }}
                    defaultValue={c.M.desc.S}
                    multiline={true}
                    inputProps={{ maxLength: 200 }}
                    onChange={e => {
                      updateCardDesc(i, e)
                      updateCard()
                    }}
                  ></InputBase>
                </div>
              )
            })}
          {/* <IconButton color="secondary" style={{width: "5rem",height: "5rem"}}>
            <h1>New</h1>
          </IconButton> */}
        </div>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <h1>Loading</h1>
      </Layout>
    )
  }
}

export default CardSet
