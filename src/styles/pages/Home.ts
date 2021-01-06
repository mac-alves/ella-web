import styled from 'styled-components'
import Table from '../../components/Table'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const Main = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'menu card card card fixed'
    'menu varied varied expected expected';
  gap: 25px;

  width: 80%;
  height: 80%;
  max-width: 2000px;
  max-height: 1100px;
  padding: 25px;

  background: ${props => props.theme.colors.backgroundColor};
  border-radius: ${props => props.theme.sizes.borderRadius};
`

export const Menu = styled.div`
  grid-area: menu;
  background-color: #95d8de;
  border-radius: ${props => props.theme.sizes.borderRadius};
  box-shadow: ${props => props.theme.other.boxShadow};
  padding: 25px 0 50px 0;
  min-width: 350px;
  position: relative;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 25px;

    img {
      width: auto;
      height: auto;
      max-width: 150px;
    }

    h3 {
      font-size: 45px;
      color: ${props => props.theme.colors.primary};
      font-style: normal;
      font-weight: bold;
    }

    p {
      color: white;
      font-family: Poppins;
      font-style: italic;
      font-weight: normal;
    }
  }

  ul {
    overflow-y: auto;
    max-height: 605px;

    &::-webkit-scrollbar {
      width: 10px;
      background: #95d8de;
    }
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: ${props => props.theme.colors.primary};
    }

    li {
      display: flex;
      padding: 10px 25px;
      transition: ${props => props.theme.other.transition};
      cursor: pointer;

      &.select {
        background-color: rgba(226, 244, 243, 0.25);
      }

      & > div {
        &:first-child {
          div {
            background-color: ${props => props.theme.colors.primary};
            border-radius: 10px;
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
        }

        &:last-child {
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          h4 {
            font-style: normal;
            font-weight: 600;
            font-size: 1.3rem;
            color: white;
            line-height: 22px;
            margin-bottom: 5px;
          }

          p {
            font-style: italic;
            font-weight: normal;
            text-align: left;
            color: white;
            line-height: 18px;
          }
        }
      }
    }
  }

  footer {
    position: absolute;
    bottom: 25px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      background-color: ${props => props.theme.colors.primary};
      border-radius: 10px;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: none;
      transition: ${props => props.theme.other.transition};

      &:focus {
        outline: 0;
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: ${props => props.theme.other.boxShadow};
      }
    }
  }
`

export const Card = styled.div`
  grid-area: card;
  background: ${props => props.theme.colors.backgroundGradient};
  border-radius: ${props => props.theme.sizes.borderRadius};
  box-shadow: ${props => props.theme.other.boxShadow};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 25px;

  header {
    display: flex;
    justify-content: space-between;
    width: 100%;

    p {
      font-size: 18px;
      color: white;
      font-style: italic;
    }
  }

  & > div {
    width: 100%;
    height: 100%;

    & ul {
      width: 25%;
      padding: 25px 0;

      li {
        margin-bottom: 25px;

        p {
          font-size: 18px;
          color: #dcfbff;
          font-style: italic;
        }

        h4 {
          color: white;
          font-size: 32px;
        }
      }
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    width: 100%;

    p {
      font-size: 18px;
      color: #dcfbff;
      font-style: italic;
    }

    h4 {
      color: white;
      font-size: 20px;
    }
  }
`

export const Fixed = styled.div`
  grid-area: fixed;
  height: 500px;

  h2 {
    font-weight: bold;
    font-size: 30px;
    color: ${props => props.theme.colors.secondary};
    text-align: center;
    margin-bottom: 15px;
  }

  ul {
    max-height: calc(100% - 60px);
    overflow-y: auto;
    padding-right: 5px;

    &::-webkit-scrollbar {
      width: 10px;
      background: #e2f4f3;
    }
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: ${props => props.theme.colors.secondary};
    }

    li {
      width: 100%;
      background: #ffffff;
      box-shadow: ${props => props.theme.other.boxShadow};
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      font-size: 18px;
      margin-bottom: 15px;

      p:first-child {
        text-transform: capitalize;
      }
    }
  }
`

export const Expected = styled(Table)`
  grid-area: expected;
  background-color: white;
  border-radius: ${props => props.theme.sizes.borderRadius};
  box-shadow: ${props => props.theme.other.boxShadow};
`

export const Varied = styled(Table)`
  grid-area: varied;
  background-color: white;
  border-radius: ${props => props.theme.sizes.borderRadius};
  box-shadow: ${props => props.theme.other.boxShadow};
`
