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
import { faSpinner, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { Spent } from '../components/Table'
import { get } from '../config/axios'
import { Line } from 'react-chartjs-2'
import { useRouter } from 'next/router'

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

        expense.spents.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateB - dateA
        })

        const spents = expense.spents.map(spent => {
          return {
            ...spent,
            id: Number(spent.id),
            value: Number(spent.value),
            date:
              spent.date === null
                ? null
                : `${spent.date.split('/')[2]}/${spent.date.split('/')[1]}`
          }
        })

        return {
          ...expense,
          type: types[expense.type],
          spents
        }
      })
    }
  })
}

const prepareData = (dataJson: any) => {
  if (dataJson) {
    return formattedBudgets(dataJson.orcamentos)
  } else {
    return []
  }
}

const optionsChart = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        display: false
      }
    ]
  }
}

const Home: React.FC = () => {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const [loadingData, setLoadingData] = useState<boolean>(true)
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [currentEstimate, setCurrentEstimate] = useState<Estimate>()

  const [dataChart, setDataChart] = useState({
    labels: [],
    datasets: [
      {
        label: 'Gastos Variados',
        type: 'line',
        data: [],
        fill: false,
        borderColor: '#2D99B6',
        backgroundColor: '#2D99B6',
        pointBorderColor: '#2D99B6',
        pointBackgroundColor: '#2D99B6',
        pointHoverBackgroundColor: '#2D99B6',
        pointHoverBorderColor: '#2D99B6'
      }
    ]
  })

  const getSpents = useCallback(
    (type: keyof TypeExpense) => {
      if (currentEstimate) {
        const expense = currentEstimate?.expenses?.find(
          exp => exp.type === type
        )
        return expense?.spents ? expense.spents : []
      }

      return []
    },
    [currentEstimate]
  )

  const setCurrent = async (estimate: Estimate) => {
    if (!estimate.expenses) {
      setDataChart(data => {
        const datasets = {
          ...data.datasets[0],
          data: []
        }

        return {
          ...data,
          labels: [],
          datasets: [datasets]
        }
      })

      setCurrentEstimate({} as Estimate)
      return
    }

    const spents = estimate.expenses.find(exp => exp.type === 'varied').spents
    const dataSpent = new Map<string, number>()

    spents.forEach(spent => {
      dataSpent.set(
        spent.date,
        dataSpent.get(spent.date)
          ? Number((dataSpent.get(spent.date) + spent.value).toFixed(2))
          : spent.value
      )
    })

    const offset = dataSpent.size - 10 <= 0 ? 0 : dataSpent.size - 10

    const dataChart = Array.from(dataSpent.values())
      .reverse()
      .splice(offset, 10)

    const labelsChart = Array.from(dataSpent.keys())
      .reverse()
      .splice(offset, 10)

    setDataChart(data => {
      const datasets = {
        ...data.datasets[0],
        data: dataChart
      }

      return {
        ...data,
        labels: labelsChart,
        datasets: [datasets]
      }
    })

    setCurrentEstimate(estimate)
  }

  const requestFileEstimate = async () => {
    setError('')

    try {
      setLoadingData(true)
      const resp = await get('/api/estimates')

      if (resp.status === 200) {
        setEstimates(prepareData(resp.data.data))
        setCurrent({} as Estimate)
        setLoadingData(false)
      } else {
        throw Object(resp.data)
      }
    } catch (error) {
      setLoadingData(false)
      if (error.data.redirect) {
        router.replace('/login')
      } else {
        setError(error.error.replaceAll('"', ''))
      }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {
      const token = window.localStorage.getItem('@ella-web')

      if (!token) {
        router.replace('/login')
        return
      }

      await requestFileEstimate()
    })()
  }, [])

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
                onClick={() => setCurrent(item)}
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
            <p>{error}</p>
            <button
              title="Carregar dados"
              onClick={() => requestFileEstimate()}
            >
              <div className={loadingData ? 'loading' : ''}>
                <FontAwesomeIcon color="#e2f4f3" size="2x" icon={faSpinner} />
              </div>
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
            <div>
              <Line data={dataChart} options={optionsChart} />
            </div>
          </div>
          <footer>
            <p>Período</p>
            <h4>
              {currentEstimate?.startDay && currentEstimate?.endDay
                ? currentEstimate?.startDay + ' - ' + currentEstimate?.endDay
                : ''}
            </h4>
          </footer>
        </Card>
        <Fixed>
          <h2>Gastos Fixos</h2>
          <ul>
            {currentEstimate?.expenses
              ?.find(exp => exp.type === 'fixed')
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
