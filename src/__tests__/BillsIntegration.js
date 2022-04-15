/**
 * @jest-environment jsdom
**/

import { screen, waitFor} from "@testing-library/dom"
import { ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import Router from "../app/Router"
import BillsUI from "../views/BillsUI.js";

jest.mock("../app/store", () => mockStore)

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to BillsUI", () => {
    test("Then fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      Router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const content1  = await screen.getByText("encore")
      expect(content1).toBeTruthy()
      const content2  = await screen.getByText("test1")
      expect(content2).toBeTruthy()
      const content3  = await screen.getByText("test3")
      expect(content3).toBeTruthy()
      const content4  = await screen.getByText("test2")
      expect(content4).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
        beforeEach(() => {
          jest.spyOn(mockStore, "bills")
          Object.defineProperty(
              window,
              'localStorage',
              { value: localStorageMock }
          )
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee',
            email: "a@a"
          }))
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.appendChild(root)
          Router()
        })
    
        test("fetches bills from an API and fails with 404 message error", async () => {
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 404"))
              }
            }})
          const html = BillsUI({ error: "Erreur 404" })
          document.body.innerHTML = html
          const message = await screen.getByText(/Erreur 404/)
          expect(message).toBeTruthy()
        })
        test("fetches messages from an API and fails with 500 message error", async () => {
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 500"))
              }
            }})
          const html = BillsUI({ error: "Erreur 500" })
          document.body.innerHTML = html
          const message = await screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy()
        })
      })
    })})
    