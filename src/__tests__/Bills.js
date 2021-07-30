import { screen } from "@testing-library/dom"
import {default as BillsUI} from "../views/BillsUI.js"
import {default as NewBillUI } from "../views/NewBillUI"
import { bills } from "../fixtures/bills.js"
import ErrorPage from "../views/ErrorPage"
import Bills, {default as BillsContainer} from "../containers/Bills"
import {default as NewBillContainer} from "../containers/NewBill"
import {default as LoadingPage} from "../views/LoadingPage"
import {default as VerticalLayout} from "../views/VerticalLayout"
import {ROUTES as ROUTES, ROUTES_PATH as ROUTES_PATH} from "../constants/routes.js"
import {default as Router} from "../app/Router"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    // on test que l'icone est bien mis en valeur
    test("Then bill icon in vertical layout should be highlighted", () => {

      VerticalLayout(120)
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      //to-do write expect expression
      //expect(html).toContain("active-icon"); // id = "layout-icon1" test id = "icon-window" la className doit être "active-icon"
      expect(1).toEqual(5)
    })

    // on test que le tri decroissant est bien effectué
    // on compare les dates (normalement triées) avec les dates triées par le test
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML) 
      const antiChrono = (a, b) => ((a.dateBrut < b.dateBrut) ? 1 : -1)
      const datesSorted = dates.sort(antiChrono)
      expect(dates).toEqual(datesSorted) 
    })

    test ("Then when on loading, loading page must be display", () => {
      const html = BillsUI({data: bills,loading: 1})
      document.body.innerHTML = html
      const loadingTest = LoadingPage()
      expect(html).toContain(loadingTest)
    })

    test ("Then when error, error page must bu display", () => {
      const html = BillsUI({error: 1})
      document.body.innerHTML = html
      const loadingTest = ErrorPage(1)
      expect(html).toContain(loadingTest)
    })



    test ("then user click on new bills, new bills must be display", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      new BillsContainer({document: document}, {onNavigate: 1}, {firestore: 1}, {localStorage: "mail@mail.com"})
      const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
      $(buttonNewBill).click()
      const htmlNewBills = NewBillUI()
      document.body.innerHTML = htmlNewBills
      new NewBillContainer ({document: document}, {onNavigate: 1}, {firestore: 1}, {localStorage: "mail@mail.com"})
      
      expect(1).toEqual(5)
    })








    test ("then user click on eye icon, bills justification must be display", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      new BillsContainer({document: document},{onNavigate: 1}, {firestore: 1}, {localStorage: "mail@mail.com"})
      const iconEye = document.querySelector(`div[data-testid="icon-eye"]`)
      $(iconEye).click()
      expect(iconEye).toEqual(document.querySelector(`div[data-testid="icon-eye"]`))
    })
  })
})


import firebase from "../__mocks__/firebase"
import mail from "../assets/svg/mail.js"

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