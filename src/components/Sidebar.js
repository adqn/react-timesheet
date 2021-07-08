import React, { useState } from 'react';

const Sidebar = ({ links, activeLink, setActiveLink, setActiveContent }) => {
  return (
    <div className="Sidebar">
      {links.map(link => {
        if (activeLink === link.title) {
          return <a
            key={link.id}
            href="#"
            className="active">
            {link.title}
          </a>
        } else {
          return <a
            key={link.id}
            href="#"
            onClick={() => { setActiveLink(link.title); setActiveContent(link.content) }}>
            {link.title}
          </a>
        }
      })}
    </div>
  )
}

export default Sidebar;