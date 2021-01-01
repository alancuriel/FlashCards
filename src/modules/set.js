import React, { useState, useEffect, useRef } from "react"
import Layout from "../components/layout"
import { Input, InputBase, IconButton, Popover, Button } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import MoreVertIcon from "@material-ui/icons/MoreVert"

const CardSet = ({ id }) => {
  const [ID, setID] = useState()
  const [cards, setCards] = useState([])
  const [name, setName] = useState("")
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
      .then(x => {
        setID(x.Item.setId)
        setName(x.Item.setTitle.S)

        if (x.Item.cards) {
          setCards(x.Item.cards.L)
        }
      })
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
            setId: ID,
          },
          UpdateExpression: "Set cards = :c",
          ExpressionAttributeValues: {
            ":c": { L: cards },
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
    newCards[index].M.title.S = event.target.value
    setCards(newCards)
  }

  const updateCardDesc = (index, event) => {
    var newCards = cards
    newCards[index].M.desc.S = event.target.value
    setCards(newCards)
  }

  const addCard = () => {
    setCards([
      ...cards,
      {
        M: {
          title: {
            S: "",
          },
          desc: {
            S: "",
          },
        },
      },
    ])
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const popref = useRef(0);

  const handleClick = (event,index) => {
    setAnchorEl(event.currentTarget);
    popref.current = index;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteCard = () => {
    
    let newCards = [...cards];
    let i = newCards.findIndex(c => c.M.title.S === popref.current);
    newCards.splice(i,1);
    setCards(newCards);
  };

  const open = Boolean(anchorEl);
  const popid = open ? 'simple-popover' : undefined;

  return (
    <Layout>
      <h1 style={{ fontSize: "4rem", marginBottom: ".5rem" }}>{name}</h1>
      <h1 style={{ marginTop: "0", opacity: 0.9 }}>{cards.length}/50 cards</h1>
      
      <Popover
        id={popid}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Button color="secondary" onClick={handleDeleteCard}>
          Delete
        </Button>
      </Popover>

      <div className="flash-cards">
        {cards.map((c, i) => {
          return (
            <div className="card" >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Input
                  defaultValue={c.M.title.S}
                  color="primary"
                  style={{
                    margin: "1.2rem 1.2rem auto",
                    width: "80%",
                    fontWeight: 600,
                  }}
                  inputProps={{ maxLength: 35, }}
                  onChange={e => {
                    updateCardTitle(i, e)
                    updateCard()
                  }}
                />
                <IconButton style={{marginRight:".2rem", marginTop: ".2rem"}} 
                onClick={(e) => handleClick(e,c.M.title.S)}>
                  <MoreVertIcon />
                </IconButton>
              </div>
              <InputBase
                style={{ margin: ".5rem 1.2rem", width: "80%" }}
                defaultValue={c.M.desc.S}
                multiline={true}
                inputProps={{ maxLength: 200 }}
                onChange={e => {
                  updateCardDesc(i, e);
                  updateCard();
                }}
              ></InputBase>
            </div>
          );
        })}
        <div
          className="card"
          style={{
            boxShadow: "0px 0px 0px 0px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconButton
            color="secondary"
            style={{ width: "6rem", height: "6rem" }}
            onClick={() => addCard()}
          >
            <AddIcon style={{ width: "2rem", height: "2rem" }} />
          </IconButton>
        </div>
      </div>
    </Layout>
  )
}

export default CardSet
