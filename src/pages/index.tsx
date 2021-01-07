import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import fs from 'fs'
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
import { faSpinner, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { Spent } from '../components/Table'
import { GetStaticProps } from 'next'
import axios from 'axios'

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
interface Props {
  data: Estimate[]
}

const formattedBudgets = (data: any): Estimate[] => {
  if (!data) {
    return []
  }

  return data.map(estimate => {
    return {
      ...estimate,
      month: estimate.month.split('/')[0],
      year: '20' + estimate.month.split('/')[1],
      endDay: estimate.endDay.split('/').reverse().join('/'),
      startDay: estimate.startDay.split('/').reverse().join('/'),
      expenses: estimate.expenses.map(expense => {
        const types = {
          'TypeExpense.FIXED': 'fixed',
          'TypeExpense.EXPECTED': 'expected',
          'TypeExpense.VARIED': 'varied'
        }

        return {
          ...expense,
          type: types[expense.type],
          spents: expense.spents.map(spent => {
            return {
              ...spent,
              id: Number(spent.id),
              date:
                spent.date === null
                  ? null
                  : `${spent.date.split('/')[2]}/${spent.date.split('/')[1]}`
            }
          })
        }
      })
    }
  })
}

const prepareData = (dataFileOrRequest: any, staticProps = true) => {
  if (dataFileOrRequest) {
    let dataJson = dataFileOrRequest

    if (staticProps) {
      dataJson = JSON.parse(dataFileOrRequest)
    }

    try {
      dataJson.orcamentos = [JSON.parse(dataJson?.orcamentos)]
    } catch (error) {}

    // eslint-disable-next-line prefer-const
    return formattedBudgets(dataJson?.orcamentos)
  } else {
    return []
  }
}

const Home: React.FC<Props> = ({ data }) => {
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
      if (data.length > 0) {
        setCurrentEstimates(data[0])
      }
      return [...data]
    })
  }, [data])

  const requestFileEstimate = async () => {
    try {
      const res = await axios.get('/upload/estimates.json')
      const data = await res.data
      console.log(data)
      setEstimates(prepareData(data, false))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Head>
        <title>EllA Money Web</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
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
                      size="lg"
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
            <button onClick={() => requestFileEstimate()}>
              <FontAwesomeIcon color="#e2f4f3" size="2x" icon={faSpinner} />
            </button>
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

export const getStaticProps: GetStaticProps = async context => {
  let estimates: Estimate[]
  let dataFile

  try {
    dataFile = fs.readFileSync('public/upload/estimates.json', 'utf8')
  } catch (error) {}

  // eslint-disable-next-line prefer-const
  estimates = prepareData(dataFile)

  return {
    props: {
      data: estimates
    } // will be passed to the page component as props
  }
}

export default Home
