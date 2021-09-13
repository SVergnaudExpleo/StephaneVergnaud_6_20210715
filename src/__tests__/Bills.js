/**
 * @jest-environment jsdom
 */

// import testing library
import userEvent from '@testing-library/user-event'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent,
  screen,
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
import VerticalLayout from '../views/VerticalLayout'
import { formatDate, formatStatus } from "../app/format.js"
import firebase from "../__mocks__/firebase.js"
import Firestore from '../app/Firestore'

describe("Given I am connected as an employee", () => {
  beforeEach(()=>{
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email:'mail@mail.com',
      password:'azerty',
      status:'connected'
    }))
  })



  describe("When I am on Bills Page", () => {
    it("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email:'mail@mail.com',
        password:'azerty',
        status:'connected'
      }))
      document.body.innerHTML = BillsUI({data:firebase,loading:true})
      const billIcon = screen.getByTestId("icon-window")
      expect(billIcon).toBeTruthy()

      expect(billIcon.classList.length).toBe(1)
      expect(billIcon.classList.contains("active-icon")).toBeTruthy()
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
      expect(document.getElementById('loading')).toBeDefined() // Rechercher l'exisance d'un id determinant
    })

    it ("Then when error, error page must bu display", () => {
      const html = BillsUI({error: 1})
      document.body.innerHTML = html
      expect(getByTestId(document,"error-message")).toBeDefined()// Rechercher l'exisance d'un id determinant
    })

    it ("then user click on new bills, new bills must be display", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const buttonNewBill = getByTestId(document.body,"btn-new-bill")
      expect(buttonNewBill).toBeTruthy()   
      Bills.onNavigate = jest.fn()  
      const testBills = new Bills({ document, onNavigate: ROUTES({ data:[]}), firestore:null, localStorage  })
      const handleClickNewBill = jest.fn(event => Bills.handleClickNewBill)
      buttonNewBill.addEventListener('click',handleClickNewBill)

      fireEvent.click(buttonNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      
      //const htmlNewBills = NewBillUI()
      //document.body.innerHTML = htmlNewBills
      expect(getByTestId(document,"form-new-bill").toBeDefined())
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


// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to BillsUI", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
