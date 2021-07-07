import React, { useState } from 'react';

const Sidebar = ({links, activeLink, setActiveLink}) => {
  // const [activeLink, setActiveLink] = useState(links[0].title);

  return (
    <div className="Sidebar">
      {links.map(link => {
        if (activeLink === link.title) {
          return <a href="#" className="active">{link.title}</a>
        } else {
          return <a href="#" onClick={() => setActiveLink(link.title)}>{link.title}</a>
        }
      })}
    </div>
  )
}

export default Sidebar;