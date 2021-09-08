// import testing library
import {userEvent} from '@testing-library/user-event'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent,
  screen,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
} from '@testing-library/dom'

// import project function
import {default as BillsUI} from "../views/BillsUI.js"
import {default as NewBillUI } from "../views/NewBillUI"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import LoadingPage from "../views/LoadingPage.js"
import ErrorPage from "../views/ErrorPage"
import {localStorageMock} from "../__mocks__/localStorage"
import { ROUTES } from "../constants/routes"
import {default as Router} from "../app/Router"

import Login, { PREVIOUS_LOCATION } from "../containers/Login.js"
import LoginUI from "../views/LoginUI"
import { type } from "jquery"
import path from "path/posix"
import VerticalLayout from '../views/VerticalLayout'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"
import Actions from './Actions.js'
import firebase from "../__mocks__/firebase.js"
import Firestore from '../app/Firestore'

describe("Given I am connected as an employee", () => {
  beforeEach(()=>{
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
    }))
  })



  describe("When I am on Bills Page", () => {
    it("Then bill icon in vertical layout should be highlighted", async () => {
      
      window.location.hash = "#employee/bills"
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))
      document.body.innerHTML = BillsUI({data:[]})
      expect(screen.getByTestId("icon-window")).toBeTruthy()

      const billIcon = screen.getByTestId("icon-window")
      const divIcon1 = document.getElementById('layout-icon1')
      divIcon1.classList.add('active-icon')
      expect(billIcon.classList.length).toBe(1)
      expect(billIcon.classList.contains("active-icon")).toBeTruthy()
      
      //
      //const html = BillsUI({ data: []})
      //document.body.innerHTML = html
    })

    it("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML) 
      const antiChrono = (a, b) => ((a.dateBrut < b.dateBrut) ? 1 : -1)
      const datesSorted = dates.sort(antiChrono)
      expect(dates).toEqual(datesSorted) // on compare les dates (normalement triées) avec les dates triées par le test
    })

    it ("Then when on loading, loading page must be display", () => {
      const html = BillsUI({data: bills,loading: 1})
      document.body.innerHTML = html
      const loadingTest = LoadingPage()
      expect(html).toContain(loadingTest)
    })

    it ("Then when error, error page must bu display", () => {
      const html = BillsUI({error: 1})
      document.body.innerHTML = html
      const loadingTest = ErrorPage(1)
      expect(html).toContain(loadingTest)
    })

    it ("then user click on new bills, new bills must be display", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const buttonNewBill = getByTestId(document.body,"btn-new-bill")
      expect(buttonNewBill).toBeTruthy()
      fireEvent.click(buttonNewBill)
      const htmlNewBills = NewBillUI()
      document.body.innerHTML = htmlNewBills
      expect(document.body.innerHTML).toContain("Envoyer une note de frais")
    })

    
    it ("then user click on eye icon, bills justification must be display", () => {

      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const newBill = new Bills({
        document,
        onNavigate: ROUTES({data:[]}),
        firestore: null,
        localStorage: window.localStorage
      });
      $.fn.modal = jest.fn()
      const iconEye = screen.queryAllByTestId("icon-eye")
      const handleClickIconEye = jest.fn(event => newBill.handleClickIconEye)
      iconEye[0].addEventListener("click", handleClickIconEye)
      fireEvent.click(iconEye[0])
      expect(handleClickIconEye).toHaveBeenCalled()
      const modal = document.getElementById("modaleFile")
      expect(modal).toBeTruthy()
    })
  })
})


/** 
import firebase from "../__mocks__/firebase"
import mail from "../assets/svg/mail.js"
import { async } from 'rsvp'

// test d'intégration GET
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to employee Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const getSpy = jest.spyOn(new Bills({document: document}, {localStorage: "mail@mail.com"}), "get")
      const billsTest = await bills.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(billsTest.data.length).toBe(4)
    })
  })
})
*/
