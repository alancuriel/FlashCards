import React from "react"

import {graphql, useStaticQuery} from 'gatsby'

const Footer = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          author
        }
      }
    }
  `)

  return (
    <div>
      <h4>Created by {data.site.siteMetadata.author}</h4>
    </div>
  )
}

export default Footer
