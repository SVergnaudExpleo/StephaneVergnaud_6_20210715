import { screen } from "@testing-library/dom"
import {default as BillsUI} from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import LoadingPage from "../views/LoadingPage"
import ErrorPage from "../views/ErrorPage"
import {default as BillsContainer} from "../containers/Bills"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    // on test que l'icone est bien mis en valeur
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      //to-do write expect expression     
      expect(html).toContain("active-icon"); // id = "layout-icon1" test id = "icon-window" la className doit être "active-icon"
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

    test ("affichage loading page", () => {
      const html = BillsUI({data: bills,loading: 1})
      document.body.innerHTML = html
      const loadingTest = LoadingPage()
      expect(html).toContain(loadingTest)
    })

    test ("affichage error page", () => {
      const html = BillsUI({error: 1})
      document.body.innerHTML = html
      const loadingTest = ErrorPage(1)
      expect(html).toContain(loadingTest)
    })

    test ("bills container test", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      var onNavigate = 1
      var firestore = 1
      var localStorage = 1
      var BillsContainerTest = new BillsContainer(document, onNavigate, firestore, localStorage)
      expect(BillsContainerTest).toEqual(1)
    }) 
  })
})