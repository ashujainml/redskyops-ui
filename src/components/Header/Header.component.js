import React from 'react'

import style from './Header.module.scss'
import logo from '../../images/carbon-rlay-logo-dark.png'

export const Header = () => {
  return (
    <header className={style.header}>
      <img className={style.logo} src={logo} alt="Carbon Relay" />
    </header>
  )
}

export default Header
