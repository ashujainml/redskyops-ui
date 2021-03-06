import React from 'react'

import {TypeTrials} from '../../../context/DefaultState'
import Icon from '../../Icon/Icon.component'
import style from './TrialsStatistics.module.scss'

const TRIALS_TYPES = {
  COMPLETED: 'completed',
  FAILED: 'failed',
}

type TypeProps = {
  trials: TypeTrials,
}

export const TrialsStatistics = ({trials}: TypeProps) => {
  const trialsStatusMap = trials.reduce((acc, t) => {
    if (t.status in acc) {
      acc[t.status].push(t)
      return acc
    }
    return {...acc, ...{[t.status]: [t]}}
  }, {})

  return (
    <div className={style.stats}>
      <div className={style.divider} />
      <ul className={style.items}>
        <li className={style.item}>
          <div className={style.icon}>
            <Icon icon="experiments" width={30} />
          </div>
          <span data-dom-id="statistics-total-text">
            Total Trials
            <br />
            <strong data-dom-id="statistics-total">{trials.length}</strong>
          </span>
        </li>
        <li className={style.item}>
          <div className={style.icon}>
            <Icon icon="circleCheck" width={30} />
          </div>
          <span data-dom-id="statistics-completed-text">
            Completed Trials
            <br />
            <strong data-dom-id="statistics-completed">
              {(trialsStatusMap[TRIALS_TYPES.COMPLETED] || []).length}
            </strong>
          </span>
        </li>
        <li className={style.item}>
          <div className={style.icon}>
            <Icon icon="circleX" width={30} />
          </div>
          <span data-dom-id="statistics-failed-text">
            Unstable Configurations
            <br />
            <strong data-dom-id="statistics-failed">
              {(trialsStatusMap[TRIALS_TYPES.FAILED] || []).length}
            </strong>
          </span>
        </li>
      </ul>
    </div>
  )
}

export default TrialsStatistics
