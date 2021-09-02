// import testing library
import { getAllByTestId, screen } from "@testing-library/dom"
import {userEvent} from '@testing-library/user-event'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
} from '@testing-library/dom'

// import project function

import {default as NewBillUI } from "../views/NewBillUI"
import {localStorageMock} from "../__mocks__/localStorage"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import firestore from "../app/Firestore"

import {default as BillsUI} from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import LoadingPage from "../views/LoadingPage.js"
import ErrorPage from "../views/ErrorPage"
import {default as Router} from "../app/Router"
import Login, { PREVIOUS_LOCATION } from "../containers/Login.js"
import LoginUI from "../views/LoginUI"
import { type } from "jquery"
import path from "path/posix"
import VerticalLayout from './VerticalLayout.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"
import Actions from './Actions.js'

describe("Given I am connected as an employee", () => {
  beforeAll(()=>{
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
    }))
  })

  describe("When I am on NewBill Page", () => {
    it("Then user select an invalid justification file, alert must be display ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      new NewBill({document, onNavigate: ROUTES, firestore, localstorage: window.localStorage})
      //to-do write assertion

      let fichier = getByTestId(document,"file")
      fichier.value = ''

      userEvent

      expect(alert).toBeTruthy()

    })
  })
})