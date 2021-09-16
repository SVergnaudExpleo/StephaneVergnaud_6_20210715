/**
 * @jest-environment jsdom
 */

// import testing library
import {userEvent} from '@testing-library/user-event'
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent,
  waitFor,
  screen,
  getAllByTestId
} from '@testing-library/dom'

// import project function
import {default as NewBillUI } from "../views/NewBillUI"
import {localStorageMock} from "../__mocks__/localStorage"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import firebase from '../__mocks__/firebase'
import firebasePost from "../__mocks__/firebasePost"
//import Firestore from "../app/Firestore"



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

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBillTest = new NewBill({document, onNavigate, firestore:null, localstorage: window.localStorage})

      window.alert = jest.fn()
      const fichier = getByTestId(document,"file")
      fireEvent.change(fichier, {
        target: {
          files: [new File(['file content'],'mauvais-type.txt',{type: 'text/plain', name: 'mauvais-type.txt'})],
        }
      })
      
      expect(window.alert).toBeCalled()
    })

    it.only("Then user select a valid justification file, alert must NOT be display ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      window.alert = jest.fn()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'firebase', { value: localStorageMock })
      window.firebase.storage('storage', JSON.stringify({
        value: 'toto',
      }))

      class Firestore {
        constructor() {
          this.store = window.firebase ? window.firebase.firestore() : () => null
          this.storage = window.firebase ? window.firebase.storage() : () => null
        }
        //ref = (path) => this.store.doc(path)
      }

      const newBillTest = new NewBill({document, onNavigate, Firestore, localstorage: window.localStorage})

      let handleChangeFile = jest.fn(NewBill.handleChangeFile)
      const  fichier = getByTestId(document,"file")
      fichier.addEventListener("change",handleChangeFile)

      fireEvent.change(fichier, {
        target: {
          files: [new File(['file content'],'bon-type.png',{type: 'image/png', name:'bon-type.png'})]
        }
      })
      
      expect(window.alert).not.toBeCalled()
    })

    it("Then user submit form, form must be submited", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const testNewBills = new NewBill({document, onNavigate, firestore:null, localstorage: window.localStorage})
      const billForm = getByTestId(document,"form-new-bill")
      const handleSubmit = jest.fn(event => NewBill.handleSubmit)
      billForm.addEventListener('submit',handleSubmit)

      fireEvent.submit(billForm)

      expect(handleSubmit).toBeCalled()
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