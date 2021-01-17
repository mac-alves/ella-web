import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding-top: 80px;
`

export const Main = styled.div`
  width: 414px;
  height: 670px;
  max-width: 414px;
  max-height: 670px;
  padding: 20px;
  margin-bottom: 30px;

  background: ${props => props.theme.colors.backgroundColor};
  border-radius: ${props => props.theme.sizes.borderRadius};

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 100px 0 15px 0;

    img {
      width: auto;
      height: auto;
      max-width: 110px;
    }

    h3 {
      font-size: 30px;
      color: ${props => props.theme.colors.primary};
      font-style: normal;
      font-weight: bold;
    }
  }

  form {
    input {
      width: 100%;
      height: 45px;

      background-color: white;
      border-radius: 5px;
      border: none;
      box-shadow: ${props => props.theme.other.boxShadow};
      margin-bottom: 15px;
      padding-left: 15px;
      color: ${props => props.theme.colors.primary};
      transition: ${props => props.theme.other.transition};

      &:focus {
        outline: 0;
        transform: scale(1.01);
      }
    }

    button {
      width: 100%;
      height: 45px;
      font-size: 14px;
      background-color: ${props => props.theme.colors.primary};
      border-radius: 5px;
      border: none;
      box-shadow: ${props => props.theme.other.boxShadow};
      color: white;
      cursor: pointer;
      transition: ${props => props.theme.other.transition};

      &:focus {
        outline: 0;
      }

      &:hover {
        transform: scale(1.01);
      }
    }

    p {
      text-align: center;
      font-size: 12px;
      color: #b56363;
      padding: 5px 0;
    }
  }
`
