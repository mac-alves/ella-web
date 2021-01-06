import styled from 'styled-components'

export const Container = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 500px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h2 {
      font-weight: bold;
      font-size: 30px;
      color: ${props => props.theme.colors.secondary};
      line-height: 30px;
    }

    p {
      line-height: 30px;
    }
  }

  & > div {
    height: calc(100% - 120px);
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

    table {
      width: 100%;
      border-collapse: collapse;

      tbody {
        tr {
          td {
            border-bottom: 0.5px solid rgb(108 194 217 / 0.4);
            font-size: 18px;
            height: 55px;

            &:first-child {
              width: 10%;
            }

            &:last-child {
              width: 15%;
              text-align: right;
              color: ${props => props.theme.colors.secondary};
            }
          }
        }
      }
    }
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      display: flex;

      button {
        width: 45px;
        height: 45px;
        background: #e2f4f3;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 25px;
        border: none;
        transition: ${props => props.theme.other.transition};

        &:hover {
          transform: scale(1.1);
          box-shadow: ${props => props.theme.other.boxShadow};
        }

        &:focus {
          outline: 0;
        }
      }
    }
  }
`
