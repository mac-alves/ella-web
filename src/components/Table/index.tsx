import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

import { Container } from './styles'

export interface Spent {
  id: number
  date: string | null
  title: string
  value: number
}

interface TableInfo {
  initialList: Spent[]
  list: Spent[]
  currentPage: number
  offset: number
  total: number
  limitRow: number
}

interface Props {
  data: Spent[]
  title: string
  limitRow?: number
  className?: string
}

const Table: React.FC<Props> = ({ data, title, limitRow = 6, className }) => {
  const [table, setTable] = useState<TableInfo>({
    initialList: [],
    list: [],
    currentPage: 1,
    offset: 0,
    total: 0,
    limitRow: 6
  })

  const navigation = (nav: keyof { left: string; right: string }) => {
    if (nav === 'right') {
      setTable(info => {
        if (!(info.currentPage < info.total / info.limitRow)) {
          return { ...info }
        }

        const currentPage =
          info.currentPage <= info.total / info.limitRow
            ? info.currentPage + 1
            : info.currentPage
        const offset = info.offset + info.limitRow

        return {
          ...info,
          currentPage,
          list: [...info.initialList].splice(offset, info.limitRow),
          offset
        }
      })
    }

    if (nav === 'left') {
      setTable(info => {
        if (info.currentPage <= 1) {
          return { ...info }
        }

        const currentPage = info.currentPage > 1 ? info.currentPage - 1 : 1
        const offset = info.offset - info.limitRow

        return {
          ...info,
          currentPage,
          list: [...info.initialList].splice(offset, info.limitRow),
          offset
        }
      })
    }
  }

  useEffect(() => {
    setTable(() => {
      return {
        initialList: data.length > 0 ? data : [],
        list: data.length > 0 ? [...data].slice(0, limitRow) : [],
        currentPage: 1,
        offset: 0,
        total: data.length,
        limitRow
      }
    })
  }, [data])

  return (
    <Container className={className}>
      <header>
        <h2>{title}</h2>
        <p>
          {table.currentPage +
            '/' +
            (table.total % table.limitRow !== 0
              ? Math.trunc(table.total / table.limitRow) + 1
              : Math.trunc(table.total / table.limitRow))}
        </p>
      </header>
      <div>
        <table>
          <tbody>
            {table.list.map(item => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.title}</td>
                <td>R$ {item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer>
        <p>Total: 12</p>
        <div>
          <button onClick={() => navigation('left')}>
            <FontAwesomeIcon color="#6DC9B7" size="lg" icon={faAngleLeft} />
          </button>
          <button onClick={() => navigation('right')}>
            <FontAwesomeIcon color="#6DC9B7" size="lg" icon={faAngleRight} />
          </button>
        </div>
      </footer>
    </Container>
  )
}

export default Table
