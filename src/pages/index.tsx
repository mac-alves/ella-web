import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'

import {
  Container,
  Main,
  Menu,
  Card,
  Fixed,
  Expected,
  Varied
} from '../styles/pages/Home'
import EllaLogo from '../assets/images/ella.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { Spent } from '../components/Table'

interface TypeExpense {
  fixed: string
  varied: string
  expected: string
}

interface Estimate {
  id: number
  month: string
  year: string
  startDay: string
  endDay: string
  salary: string
  openingBalance: string
  finalBalance: string
  expenses: Expenses[]
}

interface Expenses {
  type: keyof TypeExpense
  value: number
  lastValue: number
  spents: Spent[]
}

const menu = [
  { id: 1, title: 'Dezembro', year: 2020 },
  { id: 2, title: 'Dezembro', year: 2020 },
  { id: 3, title: 'Dezembro', year: 2020 },
  { id: 4, title: 'Dezembro', year: 2020 },
  { id: 5, title: 'Dezembro', year: 2020 },
  { id: 6, title: 'Dezembro', year: 2020 }
]
const fixos: Spent[] = [
  { id: 1, date: null, title: 'Aluguel', value: 895.15 },
  { id: 2, date: null, title: 'Aluguel', value: 895.15 },
  { id: 3, date: null, title: 'Aluguel', value: 895.15 },
  { id: 4, date: null, title: 'Aluguel', value: 895.15 }
  // { id: 5, title: 'Aluguel', valor: 895.15 },
  // { id: 6, title: 'Aluguel', valor: 895.15 },
  // { id: 7, title: 'Aluguel', valor: 895.15 },
  // { id: 8, title: 'Aluguel', valor: 895.15 }
]
const varied: Spent[] = [
  { id: 0, date: '20/12', title: 'Comida', value: 895.15 },
  { id: 1, date: '20/12', title: 'Comida', value: 895.15 },
  { id: 2, date: '20/12', title: 'Comida', value: 895.15 },
  { id: 3, date: '20/12', title: 'Comida', value: 895.15 },
  { id: 4, date: '20/12', title: 'Comida', value: 895.15 },
  { id: 5, date: '20/12', title: 'Comida', value: 895.15 }
  // { id: 6, date: '20/12', title: 'Comida', value: 895.15 }
  // { id: 7, date: '20/12', title: 'Comida', value: 895.15 },
  // { id: 8, date: '20/12', title: '8 - Agua', value: 895.15 },
  // { id: 9, date: '20/12', title: '9 - Agua', value: 895.15 },
  // { id: 10, date: '20/12', title: '10 - Agua', value: 895.15 }
]
const expected: Spent[] = [
  { id: 0, date: '20/12', title: '0 - Agua', value: 895.15 },
  { id: 1, date: '20/12', title: '1 - Agua', value: 895.15 },
  { id: 2, date: '20/12', title: '2 - Agua', value: 895.15 },
  { id: 3, date: '20/12', title: '3 - Agua', value: 895.15 },
  { id: 4, date: '20/12', title: '4 - Agua', value: 895.15 },
  { id: 5, date: '20/12', title: '5 - Agua', value: 895.15 },
  { id: 6, date: '20/12', title: '6 - Agua', value: 895.15 },
  { id: 7, date: '20/12', title: '7 - Agua', value: 895.15 },
  { id: 8, date: '20/12', title: '8 - Agua', value: 895.15 },
  { id: 9, date: '20/12', title: '9 - Agua', value: 895.15 },
  { id: 10, date: '20/12', title: '10 - Agua', value: 895.15 }
]

const fileEstimates: Estimate[] = [
  {
    id: 1,
    endDay: '31/12/2020',
    finalBalance: '1820.00',
    month: 'Dezembro',
    year: '2020',
    openingBalance: '3000.0',
    salary: '2984.0',
    startDay: '16/12/2020',
    expenses: [
      {
        lastValue: 930,
        type: 'fixed',
        value: 1030,
        spents: [
          {
            id: 1608087871863,
            date: null,
            title: 'Internet',
            value: 100.0
          },
          {
            id: 1608087871861,
            date: null,
            title: 'Aluguel',
            value: 930.0
          }
        ]
      },
      {
        lastValue: 150,
        type: 'expected',
        value: 150,
        spents: [
          {
            id: 1608087871866,
            date: '16/12',
            title: 'Energia',
            value: 150.0
          }
        ]
      },
      {
        lastValue: 30,
        type: 'varied',
        value: 100,
        spents: [
          {
            id: 1608089871866,
            date: '16/12',
            title: 'Comida',
            value: 10.0
          }
        ]
      }
    ]
  },
  {
    id: 2,
    month: 'Janeiro',
    year: '2020',
    salary: '2984.0',
    finalBalance: '120.00',
    openingBalance: '2850.0',
    endDay: '01/02/2021',
    startDay: '01/01/2021',
    expenses: [
      {
        lastValue: 930,
        type: 'fixed',
        value: 1030,
        spents: [
          {
            id: 1608087871863,
            date: null,
            title: 'Internet',
            value: 100.0
          }
        ]
      },
      {
        lastValue: 150,
        type: 'expected',
        value: 150,
        spents: [
          {
            id: 1608087871866,
            date: '16/12',
            title: 'Energia',
            value: 150.0
          },
          {
            id: 1608087871861,
            date: '16/12',
            title: 'Aluguel',
            value: 930.0
          }
        ]
      },
      {
        lastValue: 30,
        type: 'varied',
        value: 100,
        spents: [
          {
            id: 1608089871866,
            date: '16/12',
            title: 'Comida',
            value: 10.0
          }
        ]
      }
    ]
  }
]

const Home: React.FC = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [currentEstimate, setCurrentEstimates] = useState<Estimate>()

  const getSpents = useCallback(
    (type: keyof TypeExpense) => {
      if (currentEstimate) {
        const expense = currentEstimate.expenses.find(exp => exp.type === type)
        return expense.spents
      }

      return []
    },
    [currentEstimate]
  )

  useEffect(() => {
    setEstimates(() => {
      if (fileEstimates.length > 0) {
        setCurrentEstimates(fileEstimates[0])
      }
      return [...fileEstimates]
    })
  }, [])

  return (
    <Container>
      <Head>
        <title>EllA Money Web</title>
      </Head>

      <Main>
        <Menu>
          <header>
            <img src={EllaLogo} alt="Ella Logo" />
            <h3>ella</h3>
            <p>Sistema Orçamentário Pessoal</p>
          </header>

          <ul>
            {estimates.map(item => (
              <li
                key={item.id}
                onClick={() => setCurrentEstimates(item)}
                className={currentEstimate?.id === item.id ? 'select' : ''}
              >
                <div>
                  <div>
                    <FontAwesomeIcon
                      color="#e2f4f3"
                      size="2x"
                      icon={faCalendarAlt}
                    />
                  </div>
                </div>
                <div>
                  <h4>{item.month}</h4>
                  <p>{item.year}</p>
                </div>
              </li>
            ))}
          </ul>

          <footer>
            <div>
              <FontAwesomeIcon color="#e2f4f3" size="2x" icon={faFileUpload} />
            </div>
          </footer>
        </Menu>
        <Card>
          <header>
            <p>{currentEstimate?.month}</p>
            <p>{currentEstimate?.year}</p>
          </header>
          <div>
            <ul>
              <li>
                <h4>R$ {currentEstimate?.openingBalance}</h4>
                <p>Valor Inicial</p>
              </li>
              <li>
                <h4>R$ {currentEstimate?.finalBalance}</h4>
                <p>Valor Final</p>
              </li>
            </ul>
          </div>
          <footer>
            <p>Período</p>
            <h4>{currentEstimate?.startDay + '-' + currentEstimate?.endDay}</h4>
          </footer>
        </Card>
        <Fixed>
          <h2>Gastos Fixos</h2>
          <ul>
            {currentEstimate?.expenses
              .find(exp => exp.type === 'fixed')
              .spents.map(item => (
                <li key={item.id}>
                  <p>{item.title}</p>
                  <p>R$ {item.value}</p>
                </li>
              ))}
          </ul>
        </Fixed>
        <Varied data={getSpents('varied')} title="Gastos Variados" />
        <Expected data={getSpents('expected')} title="Gastos Previstos" />
      </Main>
    </Container>
  )
}

export default Home
