/**
 * @jest-environment jsdom
 */

// import testing library
import { getAllByTestId, screen } from "@testing-library/dom"
import {userEvent} from '@testing-library/user-event'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent,
  waitFor,
} from '@testing-library/dom'

// import project function
import {default as NewBillUI } from "../views/NewBillUI"
import {localStorageMock} from "../__mocks__/localStorage"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import firestore from "../app/Firestore"
import path from "path/posix"
import VerticalLayout from './VerticalLayout.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"
import Actions from './Actions.js'
import firebase from '../__mocks__/firebase'
import firebasePost from "../__mocks__/firebasePost"


describe("Given I am connected as an employee", () => {
  beforeEach(()=>{
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
      let fichier = getByTestId(document,"file")
      /* fichier.file = ''
      fireEvent.change(fichier) */
      window.alert = jest.fn()

      fireEvent.change(fichier, {
        target: {
          files: [new File(['(⌐□_□)'],'mauvais-type.txt',{type: 'text/plain', name: 'mauvais-type.txt'})],
        }
      })
      expect(window.alert).toBeCalled()
    })

    it("Then user select a valid justification file, alert must NOT be display ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      new NewBill({document: document, onNavigate: ROUTES, firestore, localstorage: window.localStorage})
      let fichier = getByTestId(document,"file")
      //importer un fichier valide //
      window.alert = jest.fn()
      firestore.storage.ref = jest.fn()
      
      //firestore.store.collection = jest.fn()
      //firestore.storage = jest.fn()
      NewBill.firestore.put = 'test'


      fireEvent.change(fichier, {
        target: {
          files: [new File(['(⌐□_□)'],'bon-type.png',{type: 'image/png', name:'bon-type.png'})]
        }
      })
      
      expect(window.alert).not.toBeCalled()
    })

    it("Then user select a valid justification file, alert must NOT be display ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      new NewBill({document, onNavigate: ROUTES, firestore:null, localstorage: window.localStorage})
      const submitBill = document.getElementById('btn-send-bill')
      expect(submitBill).toBeTruthy()
      
      const billForm = getByTestId(document,"form-new-bill")
      firestore.store.collection = jest.fn()
      fireEvent.click(submitBill)
      billForm.onSubmit = true

      expect(billForm.onSubmit).toBe(true)
    })

    // post integration test
    describe("Given I am a user connected as Employee", () => {
      describe("When I navigate to NewBills", () => {
        test("fetches bills from mock API POST", async () => {
           const getSpy = jest.spyOn(firebasePost, "post")
           const bills = await firebasePost.post()
           expect(getSpy).toHaveBeenCalledTimes(1)
           expect(bills.data.length).toBe(4)
        })
      })
    })
  })
})