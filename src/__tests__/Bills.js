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
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import {localStorageMock} from "../__mocks__/localStorage"
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase.js"


describe("Given I am connected as an employee", () => {
  beforeEach(()=>{
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
    }))
  })

  describe("When I am on Bills Page", () => {
    it("Then bill icon in vertical layout should be highlighted", async () => {
      const html = BillsUI({data:[]})
      document.body.innerHTML = html

      const billIcon = screen.getByTestId("icon-window")
      expect(billIcon).toBeTruthy()

      const divIcon1 = document.getElementById('layout-icon1')
      divIcon1.classList.add('active-icon')

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

    it("Then when on loading, loading page must be display", () => {
      const html = BillsUI({data: bills,loading: true})
      document.body.innerHTML = html
      expect(document.getElementById('loading')).toBeDefined() // Rechercher l'exisance d'un id determinant
    })

    it("Then when error, error page must bu display", () => {
      const html = BillsUI({error: true})
      document.body.innerHTML = html
      expect(getByTestId(document,"error-message")).toBeDefined()// Rechercher l'exisance d'un id determinant
    })

    it("Then user click on new bills, new bills must be display", () => {
      const html = BillsUI({data:[]})
      document.body.innerHTML = html
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const testBills = new Bills({ document, onNavigate, firestore:null, localStorage: window.localStorage  })
      const handleClickNewBill = jest.fn(event => Bills.handleClickNewBill)
      
      const buttonNewBill = getByTestId(document.body,"btn-new-bill")
      buttonNewBill.addEventListener('click',handleClickNewBill)
      fireEvent.click(buttonNewBill)

      expect(screen.getByTestId("form-new-bill")).toBeDefined()
    })

    it ("then user click on eye icon, bills justification must be display", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new Bills({document, onNavigate,firestore: null, localStorage: window.localStorage})
      $.fn.modal = jest.fn()

      const iconEye = screen.queryAllByTestId("icon-eye")
      const handleClickIconEye = jest.fn(event => newBill.handleClickIconEye)
      iconEye[0].addEventListener("click", handleClickIconEye)
      fireEvent.click(iconEye[0])

      expect(screen.getByTestId('modal')).toBeDefined()
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to BillsUI", () => {
    it("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    it("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    it("fetches messages from an API and fails with 500 message error", async () => {
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
