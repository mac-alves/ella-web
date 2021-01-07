import styled from 'styled-components'

export const Container = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 350px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-weight: bold;
      font-size: 20px;
      color: ${props => props.theme.colors.secondary};
      line-height: 30px;
    }

    p {
      font-size: 12px;
    }
  }

  & > div {
    height: calc(100% - 70px);
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
            font-size: 12px;
            height: 39px;

            &:first-child {
              width: 15%;
            }

            &:last-child {
              width: 15%;
              text-align: right;
              font-size: 14px;
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

    p {
      font-size: 12px;
    }

    div {
      display: flex;

      button {
        width: 25px;
        height: 25px;
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
