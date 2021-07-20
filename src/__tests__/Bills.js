import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    // on test que l'icone est bien mis en valeur
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
      expect(document.body.innerHTML).toContain("active-icon"); // la className doit être "active-icon"
    })

    
    // on test que le tri decroissant est bien effectué
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      // création d'un tableau de date.
      // application d'une fonction sur chaque élément du tableau et retourne un  tableau avec les résultats
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML) 
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = dates.sort(antiChrono)
      //const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted) // on compare les dates (normalement triées) avec les dates triées par le test
    })
  })
})